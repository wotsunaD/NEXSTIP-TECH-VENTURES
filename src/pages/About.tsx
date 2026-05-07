import React from 'react';
import { motion } from 'motion/react';
import { Target, Award, Users, Rocket, Heart, Shield } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      experience: '15+ years in EdTech and Digital Transformation. Former Google Lead.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      name: 'David Chen',
      role: 'Head of Curriculum',
      experience: 'PhD in Computer Science. Expert in developing K-12 digital literacy programs.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      name: 'Amina Okoro',
      role: 'Community Director',
      experience: '10+ years in community building across Sub-Saharan Africa. Passionate about youth empowerment.',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      name: 'Marcus Thorne',
      role: 'Lead Technical Instructor',
      experience: 'Full-stack developer with a focus on AI and machine learning. Mentored 500+ professionals.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision Training',
      description: 'We focus on the exact skills the market demands today.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Setting the gold standard for digital education in Africa.'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Bridging the digital divide for youth, students, and professionals.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display italic tracking-tight text-slate-900 leading-tight">
            Leaders in <span className="text-emerald-600">Digital Mastery.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We are the pioneers of digital skills training, empowering the next generation of professionals to lead in the global digital economy.
          </p>
        </motion.div>
      </section>

      {/* Vision/Mission Statements */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <value.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">{value.title}</h3>
            <p className="text-slate-600">{value.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Eye-catching Statement */}
      <section className="bg-emerald-900 rounded-[3rem] p-16 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display italic text-white leading-tight">
            "The future isn't just digital—it's what you build with it."
          </h2>
          <p className="text-emerald-100 text-lg">
            Our mission is to provide the tools, the mentorship, and the community to turn every candidate into a digital architect.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Meet the Team</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            A diverse group of experts dedicated to transforming digital education across the African continent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl aspect-square mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {member.experience}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-emerald-600 font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-4 p-2 pl-6 bg-slate-100 rounded-full">
          <span className="text-slate-600 font-medium">Want to join our mission?</span>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
