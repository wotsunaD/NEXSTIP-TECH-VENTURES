import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight, Users, Sparkles } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Digital Literacy Workshop for Kids',
      date: 'April 15, 2026',
      time: '10:00 AM - 2:00 PM',
      location: 'Lagos Tech Hub / Online',
      description: 'A fun, interactive workshop designed to introduce kids (ages 8-12) to the basics of coding and digital safety.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Pan-African Career Fair 2026',
      date: 'May 20-22, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Virtual Event',
      description: 'Connect with top tech companies across Africa and discover your next big opportunity.',
      image: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?auto=format&fit=crop&w=800&q=80',
      category: 'Career'
    },
    {
      id: 3,
      title: 'AI & Future of Work Seminar',
      date: 'June 5, 2026',
      time: '4:00 PM - 6:00 PM',
      location: 'Nairobi Innovation Center',
      description: 'Join industry experts as they discuss how AI is reshaping the professional landscape and how you can stay ahead.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      category: 'Seminar'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'Digital Skills Boot Camp 2025',
      date: 'December 2025',
      location: 'Accra, Ghana',
      description: 'A 4-week intensive boot camp for university students focusing on full-stack development.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Community Hackathon',
      date: 'October 2025',
      location: 'Online',
      description: 'A 48-hour hackathon where developers built solutions for local community challenges.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display italic tracking-tight text-slate-900">
            Community <span className="text-emerald-600">Events.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Join our vibrant community of learners and professionals at our upcoming workshops, seminars, and networking events.
          </p>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Sparkles className="text-emerald-600" /> Upcoming Events
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/5 transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-4 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-emerald-900 uppercase tracking-widest">
                  {event.category}
                </div>
              </div>
              <div className="p-8 flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
              <div className="p-8 pt-0">
                <button className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  Register Now <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-slate-900">Past Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastEvents.map((event) => (
            <div key={event.id} className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 items-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Stay Updated */}
      <section className="bg-emerald-900 rounded-[3rem] p-16 text-center text-white space-y-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-4xl font-display italic">Never miss an event.</h2>
          <p className="text-emerald-100">
            Subscribe to our community newsletter to get the latest updates on workshops, seminars, and networking opportunities.
          </p>
        </div>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button className="px-8 py-3 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-colors">
            Join
          </button>
        </div>
      </section>
    </div>
  );
};

export default Events;
