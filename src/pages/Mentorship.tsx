import React from 'react';
import { Users, Star, Calendar, MessageSquare, Award, CheckCircle } from 'lucide-react';
import { Mentor } from '../types';

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Elena Vance',
    expertise: ['Data Science', 'Machine Learning', 'Career Growth'],
    bio: 'Former Google engineer with a passion for mentoring aspiring data scientists in Africa.',
    avatar: 'https://picsum.photos/seed/elena/200',
    availability: '2 hours/week'
  },
  {
    id: '2',
    name: 'Marcus Tobi',
    expertise: ['Product Management', 'Startup Scaling', 'Fintech'],
    bio: 'Founder of three successful African startups. Here to help you navigate the entrepreneurial journey.',
    avatar: 'https://picsum.photos/seed/marcus/200',
    availability: '1 hour/week'
  }
];

const Mentorship = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 py-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-display italic text-slate-900">Mentorship Program</h1>
        <p className="text-slate-600 max-w-2xl">
          Connect with industry leaders and experts to help you grow. 
          Request for mentorship or volunteer as a mentor.
        </p>
      </header>

      {/* Program Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-3">
          <Award className="text-blue-600" size={32} />
          <h3 className="text-lg font-bold text-slate-900">Expert Guidance</h3>
          <p className="text-sm text-blue-600/70">Get 1-on-1 sessions with professionals from top tech companies.</p>
        </div>
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-3">
          <CheckCircle className="text-emerald-600" size={32} />
          <h3 className="text-lg font-bold text-slate-900">Curated Tracks</h3>
          <p className="text-sm text-emerald-600/70">Structured programs for coding, design, and leadership.</p>
        </div>
        <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl space-y-3">
          <Users className="text-purple-600" size={32} />
          <h3 className="text-lg font-bold text-slate-900">Study Groups</h3>
          <p className="text-sm text-purple-600/70">Join peer-led groups to work on projects together.</p>
        </div>
      </div>

      {/* Featured Mentors */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured Mentors</h2>
          <button className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_MENTORS.map((mentor) => (
            <div key={mentor.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row gap-6 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
              <img 
                src={mentor.avatar} 
                alt={mentor.name} 
                className="w-24 h-24 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{mentor.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.expertise.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic">"{mentor.bio}"</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Calendar size={14} /> {mentor.availability}
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
                    Request Mentorship
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="bg-emerald-900 text-white p-12 rounded-[2rem] text-center space-y-6">
        <h2 className="text-3xl font-display italic">Become a Mentor</h2>
        <p className="text-emerald-200 max-w-xl mx-auto">
          Share your experience and help shape the future of tech in Africa. 
          Join our community of volunteer mentors today.
        </p>
        <button className="px-8 py-3 bg-white text-emerald-900 rounded-full font-bold hover:bg-emerald-50 transition-colors">
          Apply to Volunteer
        </button>
      </section>
    </div>
  );
};

export default Mentorship;
