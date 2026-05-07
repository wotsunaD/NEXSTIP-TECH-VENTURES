import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, ExternalLink, Sparkles, Search } from 'lucide-react';
import { Opportunity } from '../types';

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Google Africa Developer Scholarship',
    type: 'Scholarship',
    location: 'Remote / Pan-Africa',
    deadline: '2026-05-15',
    description: 'A program to support software developers in Africa through training and certification.',
    link: 'https://buildyourfuture.withgoogle.com/scholarships',
    organization: 'Google'
  },
  {
    id: '2',
    title: 'Andela Technical Leadership Program',
    type: 'Internship',
    location: 'Lagos, Nigeria / Remote',
    deadline: '2026-04-01',
    description: 'Gain hands-on experience working with global engineering teams.',
    link: 'https://andela.com/careers',
    organization: 'Andela'
  },
  {
    id: '3',
    title: 'Senior Frontend Engineer',
    type: 'Job',
    location: 'Nairobi, Kenya',
    deadline: '2026-03-30',
    description: 'Join a fast-growing fintech startup building the future of payments in East Africa.',
    link: '#',
    organization: 'M-Pesa'
  }
];

const Opportunities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 py-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-display italic text-slate-900">Opportunities</h1>
        <p className="text-slate-600 max-w-2xl">
          Selected scholarships, internships, fellowships and jobs to accelerate your career in the tech ecosystem.
        </p>
      </header>

      {/* AI Search Section */}
      <section className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold uppercase tracking-widest">
            <Sparkles size={16} /> AI Powered Search
          </div>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for opportunities (e.g., 'Frontend jobs in Kenya' or 'Scholarships for developers')"
              className="w-full pl-12 pr-32 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200" size={20} />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
      </section>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 gap-6">
        {MOCK_OPPORTUNITIES.map((opp) => (
          <div key={opp.id} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  opp.type === 'Scholarship' ? "bg-blue-100 text-blue-600" :
                  opp.type === 'Internship' ? "bg-emerald-100 text-emerald-600" :
                  "bg-orange-100 text-orange-600"
                )}>
                  {opp.type}
                </span>
                <span className="text-slate-500 text-xs font-medium">• {opp.organization}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{opp.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> {opp.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} /> Deadline: {opp.deadline}
                </div>
              </div>
            </div>
            <a 
              href={opp.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              View Details <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Opportunities;
