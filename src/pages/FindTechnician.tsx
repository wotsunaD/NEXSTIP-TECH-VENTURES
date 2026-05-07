import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Wrench, Phone, Star, MapPin, ArrowLeft, Loader2, CheckCircle2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  phone: string;
  location: string;
  bio: string;
}

const technicians: Technician[] = [
  {
    id: '1',
    name: 'Samuel Okoro',
    specialty: 'Hardware Repair & Networking',
    rating: 4.8,
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    bio: 'Expert in laptop repairs, server maintenance, and complex network configurations.'
  },
  {
    id: '2',
    name: 'Amina Mansour',
    specialty: 'Software Troubleshooting & OS Installation',
    rating: 4.9,
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    bio: 'Specialist in malware removal, OS optimization, and software conflict resolution.'
  },
  {
    id: '3',
    name: 'Kofi Mensah',
    specialty: 'Mobile Device Specialist',
    rating: 4.7,
    phone: '+233 24 123 4567',
    location: 'Accra, Ghana',
    bio: 'Certified technician for all major smartphone brands and tablet repairs.'
  },
  {
    id: '4',
    name: 'Zanele Mbeki',
    specialty: 'Data Recovery & Security',
    rating: 5.0,
    phone: '+27 11 123 4567',
    location: 'Johannesburg, South Africa',
    bio: 'Focused on recovering lost data from damaged drives and securing systems against threats.'
  }
];

const FindTechnician = () => {
  const [problem, setProblem] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedTech, setMatchedTech] = useState<Technician | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsMatching(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given the following problem description: "${problem}"
        
        And the following list of technicians:
        ${JSON.stringify(technicians.map(t => ({ id: t.id, specialty: t.specialty, bio: t.bio })))}
        
        Identify the most suitable technician ID to solve this problem. Return ONLY the ID.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              technicianId: {
                type: Type.STRING,
                description: "The ID of the most suitable technician."
              }
            },
            required: ["technicianId"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      const tech = technicians.find(t => t.id === result.technicianId);
      
      if (tech) {
        setMatchedTech(tech);
      } else {
        // Fallback to first one if something goes wrong with AI matching
        setMatchedTech(technicians[0]);
      }
    } catch (err) {
      console.error("Matching error:", err);
      setError("Failed to match with a technician. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Home
      </Link>

      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Wrench size={32} />
          </div>
          <h1 className="text-4xl font-display italic tracking-tight text-slate-900">Find Your Technical Expert</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Describe your technical issue in detail, and our AI will match you with the best technician for the job.
          </p>
        </div>

        {!matchedTech ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >
            <form onSubmit={handleMatch} className="space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-semibold text-slate-900 mb-2">
                  What's the problem?
                </label>
                <textarea
                  id="problem"
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="e.g., My laptop screen is flickering and showing blue lines, or I need help setting up a secure office network..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={isMatching || !problem.trim()}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isMatching ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Matching you with an expert...
                  </>
                ) : (
                  'Find My Match'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4 text-emerald-800">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <p className="font-medium">We've found the perfect match for your problem!</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                      <Users size={40} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{matchedTech.name}</h2>
                      <p className="text-emerald-600 font-medium">{matchedTech.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-bold">
                    <Star size={18} fill="currentColor" />
                    {matchedTech.rating}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={20} className="text-slate-400" />
                    <span>{matchedTech.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={20} className="text-slate-400" />
                    <span>{matchedTech.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">About the Technician</h3>
                  <p className="text-slate-600 leading-relaxed">{matchedTech.bio}</p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`tel:${matchedTech.phone}`}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    <Phone size={20} />
                    Call Now
                  </a>
                  <button
                    onClick={() => setMatchedTech(null)}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Try Another Description
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FindTechnician;
