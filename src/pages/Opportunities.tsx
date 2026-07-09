import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Search, 
  Bookmark, 
  Share2, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Globe, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { SheetOpportunity } from '../types';

// Helper to decode HTML entities from the CSV data
function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'");
}

// RFC 4180 compliant CSV parser to handle newlines, quotes, and commas inside fields
function parseCSVText(text: string): SheetOpportunity[] {
  const result: string[][] = [];
  let row: string[] = [];
  let curr = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          curr += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        curr += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(curr.trim());
        curr = '';
      } else if (char === '\r' || char === '\n') {
        row.push(curr.trim());
        curr = '';
        if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        curr += char;
      }
    }
  }
  
  if (row.length > 0 || curr !== '') {
    row.push(curr.trim());
    result.push(row);
  }
  
  if (result.length === 0) return [];
  
  // Header should be the first row
  const opportunitiesRows = result.slice(1);
  
  return opportunitiesRows
    .filter(r => r.length >= 5 && r[0] !== '') // Filter out malformed empty rows
    .map((r, index) => {
      return {
        id: `opp-${index}`,
        name: decodeHTMLEntities(r[0] || ''),
        type: decodeHTMLEntities(r[1] || 'Other'),
        countries: decodeHTMLEntities(r[2] || 'Global'),
        dueDate: decodeHTMLEntities(r[3] || 'No Deadline'),
        notes: decodeHTMLEntities(r[4] || ''),
        areaOfInterest: decodeHTMLEntities(r[5] || 'General'),
        link: r[6] || '#'
      };
    });
}

// Parses due date string M/D/YYYY to Date object
function parseDueDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase().includes('no deadline') || dateStr.toLowerCase().includes('ongoing')) {
    return null;
  }
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) return date;
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

const Opportunities = () => {
  const navigate = useNavigate();
  
  // Core state
  const [opportunities, setOpportunities] = useState<SheetOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('All'); // All, Upcoming, Past due, Ongoing, Year-2025, Year-2026
  const [sortBy, setSortBy] = useState('default'); // default, soonest, furthest, name-asc, name-desc
  
  // Bookmarks & local states
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Search state inside filter sidebar
  const [countrySearch, setCountrySearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  
  // Mobile filter drawer visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Today reference
  const todayRef = useMemo(() => new Date(2026, 6, 8), []); // July 8, 2026 as per metadata

  // Load CSV data & Bookmarks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try fetching the public spreadsheet CSV fallback directly
        const response = await fetch('/opportunities.csv');
        if (!response.ok) {
          throw new Error('Fallback fetch returned error status');
        }
        const text = await response.text();
        const parsed = parseCSVText(text);
        setOpportunities(parsed);
      } catch (err: any) {
        console.error('Error fetching opportunities:', err);
        setError('Unable to load opportunities sheet. Please try reloading the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('opp_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
  }, []);

  // Sync bookmarks to localStorage
  const toggleBookmark = (id: string) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(bId => bId !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('opp_bookmarks', JSON.stringify(updated));
  };

  // Share link trigger
  const handleShare = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Derive unique Types, Countries, and Areas of Interest from all parsed data for filters
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const countries = new Set<string>();
    const areas = new Set<string>();

    opportunities.forEach(opp => {
      if (opp.type) types.add(opp.type);
      if (opp.countries) {
        opp.countries.split(',').map(c => c.trim()).forEach(c => {
          if (c && c.toLowerCase() !== 'global' && c.toLowerCase() !== 'all countries') {
            countries.add(c);
          }
        });
      }
      if (opp.areaOfInterest) {
        opp.areaOfInterest.split(',').map(a => a.trim()).forEach(a => {
          if (a) areas.add(a);
        });
      }
    });

    return {
      types: Array.from(types).sort(),
      countries: Array.from(countries).sort(),
      areas: Array.from(areas).sort()
    };
  }, [opportunities]);

  // Handle individual country checklist toggle
  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
    setCurrentPage(1);
  };

  // Handle individual area checklist toggle
  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
    setCurrentPage(1);
  };

  // Clear all current filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedCountries([]);
    setSelectedAreas([]);
    setDateFilter('All');
    setSortBy('default');
    setShowBookmarksOnly(false);
    setCurrentPage(1);
  };

  // Filter & Sort opportunities
  const processedOpportunities = useMemo(() => {
    let result = [...opportunities];

    // 1. Bookmarks Only
    if (showBookmarksOnly) {
      result = result.filter(opp => bookmarks.includes(opp.id));
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(opp => 
        opp.name.toLowerCase().includes(q) ||
        opp.notes.toLowerCase().includes(q) ||
        opp.countries.toLowerCase().includes(q) ||
        opp.areaOfInterest.toLowerCase().includes(q) ||
        opp.type.toLowerCase().includes(q)
      );
    }

    // 3. Type Filter
    if (selectedType !== 'All') {
      result = result.filter(opp => opp.type === selectedType);
    }

    // 4. Country Filter
    if (selectedCountries.length > 0) {
      result = result.filter(opp => {
        const oppCountries = opp.countries.split(',').map(c => c.trim().toLowerCase());
        // Show if any selected country matches or if opportunity is "Global" or "All Countries"
        return oppCountries.some(c => 
          selectedCountries.map(sc => sc.toLowerCase()).includes(c) ||
          c === 'global' ||
          c === 'all countries'
        );
      });
    }

    // 5. Area of Interest Filter
    if (selectedAreas.length > 0) {
      result = result.filter(opp => {
        const oppAreas = opp.areaOfInterest.split(',').map(a => a.trim().toLowerCase());
        return oppAreas.some(a => selectedAreas.map(sa => sa.toLowerCase()).includes(a));
      });
    }

    // 6. Due Date Filter
    if (dateFilter !== 'All') {
      result = result.filter(opp => {
        const parsedDate = parseDueDate(opp.dueDate);
        
        if (dateFilter === 'Ongoing') {
          return !parsedDate;
        }
        
        if (parsedDate) {
          if (dateFilter === 'Upcoming') {
            return parsedDate >= todayRef;
          }
          if (dateFilter === 'Past due') {
            return parsedDate < todayRef;
          }
          if (dateFilter === 'Year-2025') {
            return parsedDate.getFullYear() === 2025;
          }
          if (dateFilter === 'Year-2026') {
            return parsedDate.getFullYear() === 2026;
          }
        }
        return false;
      });
    }

    // 7. Sorting
    const currentOpps = result.filter(opp => {
      const d = parseDueDate(opp.dueDate);
      return !d || d >= todayRef;
    });
    const pastDueOpps = result.filter(opp => {
      const d = parseDueDate(opp.dueDate);
      return d && d < todayRef;
    });

    const sortList = (list: typeof result) => {
      if (sortBy === 'soonest') {
        list.sort((a, b) => {
          const dateA = parseDueDate(a.dueDate);
          const dateB = parseDueDate(b.dueDate);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1; // Put ongoing last
          if (!dateB) return -1;
          return dateA.getTime() - dateB.getTime();
        });
      } else if (sortBy === 'furthest') {
        list.sort((a, b) => {
          const dateA = parseDueDate(a.dueDate);
          const dateB = parseDueDate(b.dueDate);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1; // Put ongoing last
          if (!dateB) return -1;
          return dateB.getTime() - dateA.getTime();
        });
      } else if (sortBy === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'name-desc') {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }
      return list;
    };

    const sortedCurrent = sortList([...currentOpps]);
    const sortedPastDue = sortList([...pastDueOpps]);

    result = [...sortedCurrent, ...sortedPastDue];

    return result;
  }, [opportunities, searchQuery, selectedType, selectedCountries, selectedAreas, dateFilter, sortBy, showBookmarksOnly, bookmarks, todayRef]);

  // Paginated active chunk
  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedOpportunities.slice(startIndex, startIndex + itemsPerPage);
  }, [processedOpportunities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedOpportunities.length / itemsPerPage);

  // Sidebar Filter list search filters
  const filteredCountriesList = useMemo(() => {
    return filterOptions.countries.filter(c => 
      c.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [filterOptions.countries, countrySearch]);

  const filteredAreasList = useMemo(() => {
    return filterOptions.areas.filter(a => 
      a.toLowerCase().includes(areaSearch.toLowerCase())
    );
  }, [filterOptions.areas, areaSearch]);

  // Check if any filters are active to show clear button
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== '' ||
      selectedType !== 'All' ||
      selectedCountries.length > 0 ||
      selectedAreas.length > 0 ||
      dateFilter !== 'All' ||
      sortBy !== 'default' ||
      showBookmarksOnly
    );
  }, [searchQuery, selectedType, selectedCountries, selectedAreas, dateFilter, sortBy, showBookmarksOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold tracking-wider text-sm uppercase">
           
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900">
            All round  for you.
          </h1>
          <p className="text-slate-600 max-w-3xl">
            Explore curated, high-impact opportunities sourced from around the globe.
          </p>
        </div>
        
        {/* Info stats pill */}
        {!loading && !error && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-5 py-3 rounded-2xl border border-emerald-100 self-start md:self-end">
            <Briefcase size={20} className="text-emerald-600" />
            <div>
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Total Opportunities</p>
              <p className="text-lg font-bold leading-none mt-0.5">{opportunities.length.toLocaleString()}</p>
            </div>
          </div>
        )}
      </header>

      {/* Main Controls Panel (Search and quick toggles) */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Real-time Keyword Search */}
        <div className="relative flex-1">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search keywords, countries, topics, or organizations..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-100 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick bookmarks and reset toggles */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowBookmarksOnly(!showBookmarksOnly);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold border transition-all shadow-sm text-sm ${
              showBookmarksOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={16} className={showBookmarksOnly ? 'fill-current' : ''} />
            <span>Saved ({bookmarks.length})</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-semibold text-sm transition-all shadow-sm"
            >
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Mobile filter button trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl font-semibold text-sm transition-all shadow-sm"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar filters & Main listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar (Hidden on mobile, block on large screens) */}
        <aside className="hidden lg:block lg:col-span-4 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 space-y-6 sticky top-6 max-h-[85vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-emerald-600" />
              Filter By
            </h2>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Opportunity Type</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedType('All'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedType === 'All'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              {filterOptions.types.map(type => {
                const count = opportunities.filter(o => o.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedType === type
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{type}</span>
                    <span className={`text-[10px] opacity-70 ${selectedType === type ? 'text-white' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date Deadline Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Deadline Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'All', label: 'All Deadlines' },
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Past due', label: 'Past due' },
                { value: 'Ongoing', label: 'Ongoing Only' },
                { value: 'Year-2025', label: 'Due in 2025' },
                { value: 'Year-2026', label: 'Due in 2026' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setDateFilter(opt.value); setCurrentPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    dateFilter === opt.value
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Sort Results</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="default">Recently Curated First</option>
              <option value="soonest">Deadline: Soonest First</option>
              <option value="furthest">Deadline: Furthest First</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
            </select>
          </div>

          {/* Country Filter Checkbox list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Country</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            </div>
            
            <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-200/50 rounded-xl p-2 bg-white no-scrollbar">
              {filteredCountriesList.length === 0 ? (
                <p className="text-slate-400 text-xs p-2 text-center">No countries match</p>
              ) : (
                filteredCountriesList.map(country => {
                  const isChecked = selectedCountries.includes(country);
                  return (
                    <label 
                      key={country} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/50 font-bold text-emerald-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCountry(country)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="truncate">{country}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Area of Interest Filter Checkbox list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Area of Interest</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search areas..."
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            </div>
            
            <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-200/50 rounded-xl p-2 bg-white no-scrollbar">
              {filteredAreasList.length === 0 ? (
                <p className="text-slate-400 text-xs p-2 text-center">No categories match</p>
              ) : (
                filteredAreasList.map(area => {
                  const isChecked = selectedAreas.includes(area);
                  return (
                    <label 
                      key={area} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/50 font-bold text-emerald-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArea(area)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="truncate">{area}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Main List Section (Right columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active stats count */}
          {!loading && !error && (
            <div className="flex items-center justify-between text-sm text-slate-500 px-2">
              <p>
                Showing <span className="font-bold text-slate-800">{processedOpportunities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-800">
                  {Math.min(currentPage * itemsPerPage, processedOpportunities.length)}
                </span>{' '}
                of <span className="font-bold text-slate-800">{processedOpportunities.length}</span> opportunities
              </p>
              
              {/* Items per page selector */}
              <div className="hidden sm:flex items-center gap-2">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg text-xs px-2 py-1 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          )}

          {/* Skeleton Loaders */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-slate-200 rounded-lg" />
                    <div className="h-6 w-6 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-7 w-2/3 bg-slate-200 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-4 w-4/5 bg-slate-200 rounded" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-5 w-24 bg-slate-200 rounded-lg" />
                    <div className="h-5 w-24 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-3xl text-center space-y-4">
              <Info className="mx-auto text-red-500" size={32} />
              <h3 className="text-lg font-bold">Data Loading Issue</h3>
              <p className="max-w-md mx-auto text-sm text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && processedOpportunities.length === 0 && (
            <div className="bg-slate-50 border border-slate-200/50 p-12 rounded-3xl text-center space-y-6">
              <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">No opportunities match filters</h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm">
                  We couldn't find any opportunities matching your exact criteria. Try adjusting your keyword search or clearing some filters.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-sm transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Opportunities Cards */}
          {!loading && !error && processedOpportunities.length > 0 && (
            <div className="space-y-4">
              {paginatedOpportunities.map((opp) => {
                const isBookmarked = bookmarks.includes(opp.id);
                const isExpanded = !!expandedNotes[opp.id];
                const cleanNotes = opp.notes.trim();
                const noteIsLong = cleanNotes.length > 220;
                
                // Show condensed notes if collapsed
                const displayedNotes = noteIsLong && !isExpanded 
                  ? `${cleanNotes.substring(0, 220)}...` 
                  : cleanNotes;

                return (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between gap-5 relative overflow-hidden group"
                  >
                    <div className="space-y-3">
                      {/* Top tags row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Type badge */}
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            opp.type === 'Scholarship' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                            opp.type === 'Internship' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                            opp.type === 'Fellowship' ? 'bg-purple-50 text-purple-700 border-purple-200/50' :
                            opp.type === 'Grant' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                            opp.type === 'Challenge' || opp.type === 'Awards' || opp.type.includes('Prizes') ? 'bg-rose-50 text-rose-700 border-rose-200/50' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {opp.type}
                          </span>

                          {/* Country tag */}
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[11px] font-medium border border-slate-100">
                            <Globe size={11} className="text-slate-400" />
                            <span className="max-w-[150px] truncate">{opp.countries}</span>
                          </span>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShare(opp.id, opp.link)}
                            className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all relative"
                            title="Copy link to clipboard"
                          >
                            {copiedId === opp.id ? (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap shadow-md z-20">
                                Copied!
                              </span>
                            ) : null}
                            <Share2 size={16} />
                          </button>
                          
                          <button
                            onClick={() => toggleBookmark(opp.id)}
                            className={`p-2 rounded-full transition-all ${
                              isBookmarked 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'hover:bg-slate-50 text-slate-300 hover:text-slate-500'
                            }`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                          >
                            <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                        {opp.name}
                      </h3>

                      {/* Area of Interest Category tags */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <Tag size={12} className="text-slate-400 mr-1" />
                        {opp.areaOfInterest.split(',').map((area, i) => (
                          <span 
                            key={i}
                            className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            {area.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Notes / Description text */}
                      {cleanNotes && (
                        <div className="text-sm text-slate-600 leading-relaxed pt-1 whitespace-pre-line">
                          {displayedNotes}
                          
                          {noteIsLong && (
                            <button
                              onClick={() => setExpandedNotes(prev => ({...prev, [opp.id]: !prev[opp.id]}))}
                              className="inline-flex items-center gap-0.5 ml-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                            >
                              {isExpanded ? (
                                <>Show Less <ChevronUp size={12} /></>
                              ) : (
                                <>Read More <ChevronDown size={12} /></>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Row (Deadline and Button) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Calendar size={14} className="text-slate-400" />
                        <span>Deadline:</span>
                        <span className={`px-2 py-0.5 rounded ${
                          opp.dueDate.toLowerCase().includes('ongoing') || opp.dueDate.toLowerCase().includes('no deadline')
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : parseDueDate(opp.dueDate) && parseDueDate(opp.dueDate)! < todayRef
                              ? 'bg-red-50 text-red-600 line-through opacity-70'
                              : 'text-slate-700 bg-slate-100'
                        }`}>
                          {opp.dueDate}
                        </span>
                      </div>

                      <a 
                        href={opp.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        Visit Official Site <ExternalLink size={12} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </span>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-over Filter Panel */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-slate-100 shadow-2xl p-6 space-y-6 overflow-y-auto z-50 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-emerald-600" />
                  Filter Options
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Reset filter in Mobile */}
              {hasActiveFilters && (
                <button
                  onClick={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all"
                >
                  Clear All Filters
                </button>
              )}

              {/* Same Sidebar Content formatted for Mobile */}
              {/* Type */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Opportunity Type</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedType('All'); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedType === 'All' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  {filterOptions.types.map(type => (
                    <button
                      key={type}
                      onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedType === type ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Deadline Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'All', label: 'All Deadlines' },
                    { value: 'Upcoming', label: 'Upcoming' },
                    { value: 'Past due', label: 'Past due' },
                    { value: 'Ongoing', label: 'Ongoing Only' },
                    { value: 'Year-2025', label: 'Due in 2025' },
                    { value: 'Year-2026', label: 'Due in 2026' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setDateFilter(opt.value); setCurrentPage(1); }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        dateFilter === opt.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sort Results</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="default">Recently Curated</option>
                  <option value="soonest">Deadline: Soonest First</option>
                  <option value="furthest">Deadline: Furthest First</option>
                  <option value="name-asc">Alphabetical (A - Z)</option>
                  <option value="name-desc">Alphabetical (Z - A)</option>
                </select>
              </div>

              {/* Country */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Country</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  {filteredCountriesList.map(country => {
                    const isChecked = selectedCountries.includes(country);
                    return (
                      <label key={country} className="flex items-center gap-2 p-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCountry(country)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="truncate">{country}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Areas */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Area of Interest</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search areas..."
                    value={areaSearch}
                    onChange={(e) => setAreaSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  {filteredAreasList.map(area => {
                    const isChecked = selectedAreas.includes(area);
                    return (
                      <label key={area} className="flex items-center gap-2 p-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArea(area)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="truncate">{area}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all mt-4"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Close Icon for mobile drawer
const XIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Opportunities;
