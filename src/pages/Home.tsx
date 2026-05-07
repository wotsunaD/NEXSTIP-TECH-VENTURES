import React from 'react';
import { 
  ArrowRight, BookOpen, MapPin, Briefcase, Lightbulb, Users, Wrench, 
  GraduationCap, UserSearch, Info, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Digital Skills Courses',
      description: 'Master general purpose digital tools, coding, design, work software both self-paced and expert-led.',
      icon: BookOpen,
      to: '/courses',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Opportunities',
      description: 'Discover scholarships, internships, and jobs across the African continent.',
      icon: Briefcase,
      to: '/opportunities',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Tips & Tricks',
      description: 'Find or share hacks working with digital devices or software. Each share earns you points where you can emerge among the monthly winners of our branded items.',
      icon: Lightbulb,
      to: '/tips-and-tricks',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Mentorship Program',
      description: 'Connect with industry experts for guidance and career growth.',
      icon: Users,
      to: '/mentorship',
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative pt-40 pb-40 overflow-hidden bg-slate-50">
        <section className="relative z-10 text-center space-y-6 max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display italic tracking-tight text-slate-900">
            Empowering Your <span className="text-emerald-600">Digital Journey.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            NEXSTIP is your all-in-one platform for digital mastery, 
            career growth, community connection and solving your IT issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/courses" 
              className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <GraduationCap size={18} /> Start Learning <ArrowRight size={18} />
            </Link>
            <Link 
              to="/find-trainer" 
              className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <UserSearch size={18} className="text-emerald-600" /> Find a Trainer
            </Link>
            <Link 
              to="/find-technician" 
              className="px-8 py-3 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2"
            >
              <Wrench size={18} /> Find a Technician
            </Link>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Discover More Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
              <Info size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">About us</h2>
              <p className="text-slate-600 leading-relaxed">
                Learn more about our journey as leaders in digital skills training for students, and professionals across Africa.
              </p>
            </div>
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
            >
              Learn About Us <ArrowRight size={20} />
            </Link>
          </div>

          <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
              <Calendar size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Community Events</h2>
              <p className="text-slate-600 leading-relaxed">
                Stay updated with our latest workshops, seminars, and networking events designed to boost your digital career.
              </p>
            </div>
            <Link 
              to="/events" 
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
            >
              View Events <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              to={feature.to}
              className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 mb-6">{feature.description}</p>
              <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </section>
      </div>
  </div>
  );
};

export default Home;
