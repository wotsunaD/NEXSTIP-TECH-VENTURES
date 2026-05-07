import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Plus, Tag, MessageCircle, ArrowUpCircle, Sparkles, Monitor, Laptop, Smartphone, Trophy } from 'lucide-react';
import { ForumPost } from '../types';
import { geminiService } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

const MOCK_TIPS: ForumPost[] = [
  {
    id: '1',
    title: 'Speed up your Windows laptop in 5 minutes',
    content: 'Disable startup apps that you don\'t need. Go to Task Manager > Startup and disable high impact apps. Also, clear your temp files by typing %temp% in the run dialog.',
    author: 'TechGuru',
    authorRole: 'Technician',
    createdAt: '2026-03-12T10:00:00Z',
    replies: 8,
    tags: ['Windows', 'Performance', 'Laptop']
  },
  {
    id: '2',
    title: 'Hidden iPhone trick for faster typing',
    content: 'Did you know you can use the spacebar as a trackpad? Just long-press the spacebar and slide your finger to move the cursor precisely between letters.',
    author: 'MobileExpert',
    authorRole: 'Mentor',
    createdAt: '2026-03-11T15:30:00Z',
    replies: 15,
    tags: ['iPhone', 'iOS', 'Productivity']
  },
  {
    id: '3',
    title: 'How to extend your laptop battery life',
    content: 'Lower your screen brightness, turn off keyboard backlighting when not needed, and use the "Battery Saver" mode. Also, avoid keeping it plugged in at 100% all the time.',
    author: 'BatterySaver',
    authorRole: 'Student',
    createdAt: '2026-03-10T09:15:00Z',
    replies: 4,
    tags: ['Battery', 'Laptop', 'Hardware']
  }
];

const TOP_CONTRIBUTORS = [
  { name: 'TechGuru', points: 1250, avatar: 'T' },
  { name: 'MobileExpert', points: 980, avatar: 'M' },
  { name: 'DigitalWizard', points: 850, avatar: 'D' },
  { name: 'SkillMaster', points: 720, avatar: 'S' },
  { name: 'CodeCrafter', points: 640, avatar: 'C' }
];

const TipsAndTricks = () => {
  const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getAiAdvice = async (postId: string, question: string) => {
    setLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await geminiService.getForumAdvice(question);
      setAiAdvice(prev => ({ ...prev, [postId]: res }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-display italic text-slate-900">Tips & Tricks</h1>
          <p className="text-slate-600">Discover and share tips and tricks working with digital devices and software.</p>
        </div>
        <Link 
          to="/share-video-trick"
          className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 self-start"
        >
          <Plus size={20} /> Share a Trick
        </Link>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold whitespace-nowrap">
          <Monitor size={16} /> Desktop
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-slate-200 transition-colors">
          <Laptop size={16} /> Laptop
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-slate-200 transition-colors">
          <Smartphone size={16} /> Mobile
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-slate-200 transition-colors">
          <Monitor size={16} /> Software
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {MOCK_TIPS.map((tip) => (
            <div key={tip.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                    {tip.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{tip.author}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{tip.authorRole}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(tip.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{tip.title}</h3>
              <p className="text-slate-600 line-clamp-3">{tip.content}</p>

              <div className="flex flex-wrap gap-2">
                {tip.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg flex items-center gap-1 border border-slate-100">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} /> {tip.replies} comments
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpCircle size={16} /> 42 helpful
                  </div>
                </div>
                <button 
                  onClick={() => getAiAdvice(tip.id, tip.title + ": " + tip.content)}
                  disabled={loading[tip.id]}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-opacity"
                >
                  <Sparkles size={14} /> {loading[tip.id] ? 'Thinking...' : 'Ask AI Expert'}
                </button>
              </div>

              {aiAdvice[tip.id] && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Sparkles size={12} /> AI Expert Tip
                  </div>
                  <div className="prose prose-sm max-w-none text-emerald-900">
                    <ReactMarkdown>{aiAdvice[tip.id]}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-emerald-900 text-white p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Top Contributors</h3>
            </div>
            <div className="space-y-4">
              {TOP_CONTRIBUTORS.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center text-emerald-200 font-bold text-xs border border-emerald-700">
                      {contributor.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-50">{contributor.name}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Rank #{index + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-emerald-400">{contributor.points}</div>
                    <div className="text-[10px] text-emerald-500 uppercase font-bold">Points</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 border border-slate-200 bg-slate-50 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Why Share?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
             <p> Helping others master their devices and software builds a stronger digital community. </p>
              <p>Earn points for every helpful tip or trick you share!</p>
              <p>Win our branded items!</p>
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Lightbulb size={16} /> 1,240 tricks shared today
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TipsAndTricks;
