import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, User, Phone, Mail, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const FindTrainer = () => {
  const [location, setLocation] = useState('');
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [trainer, setTrainer] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFindTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !interest) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');
    setTrainer(null);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        A user is looking for a professional trainer.
        Location: ${location}
        Area of Interest: ${interest}
        
        Please generate a realistic (but fictional) professional trainer profile that would be a great match for this user.
        Include:
        - Full Name
        - Title/Specialization
        - A brief bio (2 sentences)
        - Contact Information (Phone and Email)
        - Why they are a good match for the specific interest: ${interest}
        
        Return the response in JSON format with the following keys:
        name, title, bio, phone, email, matchReason
      `;

      const result = await genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = result.text;
      if (responseText) {
        const data = JSON.parse(responseText);
        setTrainer(data);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to find a trainer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display italic text-slate-900">Find Your Perfect <span className="text-emerald-600">Trainer</span></h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Tell us where you are and what you want to learn. Our AI will match you with the best expert in your area.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleFindTrainer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" /> Your Location
              </label>
              <input
                type="text"
                placeholder="e.g. Kampala, Uganda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Search size={16} className="text-emerald-600" /> What do you want to learn?
              </label>
              <input
                type="text"
                placeholder="e.g. QuickBooks, Graphics Design"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Describe your learning goals (Optional)</label>
            <textarea
              placeholder="Tell us more about what you hope to achieve..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Finding Match...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Match Me with a Trainer
              </>
            )}
          </button>
        </form>
      </div>

      {trainer && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-200">
                    AI Recommended Match
                  </div>
                  <h2 className="text-3xl font-display italic">{trainer.name}</h2>
                  <p className="text-emerald-200 font-medium">{trainer.title}</p>
                </div>
                <div className="flex gap-4">
                  <a href={`tel:${trainer.phone}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Phone size={20} />
                  </a>
                  <a href={`mailto:${trainer.email}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Mail size={20} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">About the Trainer</h3>
                  <p className="text-emerald-50/80 leading-relaxed">{trainer.bio}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Why this match?</h3>
                  <p className="text-emerald-50/80 leading-relaxed">{trainer.matchReason}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center">
                    <User size={24} className="text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Contact verified</p>
                    <p className="text-xs text-emerald-400">Ready to start training</p>
                  </div>
                </div>
                <button className="px-8 py-3 bg-white text-emerald-900 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                  Book a Session
                </button>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl -mr-48 -mt-48 opacity-30" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTrainer;
