import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { Opportunity } from '../types';
import ReactMarkdown from 'react-markdown';

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

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await geminiService.searchOpportunities(query, MOCK_OPPORTUNITIES);
        setResult(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <Link 
        to="/opportunities" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Opportunities
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-emerald-600">
          <Search size={32} />
          <h1 className="text-4xl font-display italic text-slate-900">Search Results</h1>
        </div>
        <p className="text-slate-600">
          Showing AI-powered recommendations for: <span className="font-bold text-slate-900">"{query}"</span>
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">AI is analyzing opportunities for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold uppercase tracking-widest">
                <Sparkles size={18} /> AI Analysis
              </div>
              <div className="prose prose-emerald max-w-none">
                <ReactMarkdown>{result || "No specific results found for your query. Try adjusting your search terms."}</ReactMarkdown>
              </div>
            </section>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-slate-900">All Available Opportunities</h2>
              <div className="grid grid-cols-1 gap-4">
                {MOCK_OPPORTUNITIES.map((opp) => (
                  <div key={opp.id} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          opp.type === 'Scholarship' ? "bg-blue-100 text-blue-600" :
                          opp.type === 'Internship' ? "bg-emerald-100 text-emerald-600" :
                          "bg-orange-100 text-orange-600"
                        }`}>
                          {opp.type}
                        </span>
                        <span className="text-slate-500 text-xs font-medium">• {opp.organization}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} /> {opp.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} /> {opp.deadline}
                        </div>
                      </div>
                    </div>
                    <a 
                      href={opp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-50 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      View <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
              <h3 className="text-xl font-bold">Search Tips</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Be specific about the role (e.g., "UI/UX Designer")
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Include a location if relevant (e.g., "Remote" or "Lagos")
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  Mention your skill level (e.g., "Entry level" or "Senior")
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
