import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart, PlayCircle, Star, ArrowLeft } from 'lucide-react';
import { Course } from '../types';

const MOCK_COURSES: Course[] = [
   {
    id: '1',
    title: 'Introduction to Word Processing',
    description: 'Learn how to create, edit, format, and manage professional documents using microsoft word.',
    instructor: 'Samuel Okoro',
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Computer Literacy',
    thumbnail: 'https://picsum.photos/seed/react/800/450'
  },
  {
    id: '2',
    title: 'Introduction to Excel',
    description: 'Learn how to organize, manipulate, and analyze data professionally.',
    instructor: 'Derick Wotsuna',
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Computer Literacy',
    thumbnail: 'https://picsum.photos/seed/react/800/450'
  },
  {
    id: '3',
    title: 'Modern Web Development with React',
    description: 'Learn to build professional web applications using React, Tailwind CSS, and TypeScript.',
    instructor: 'Samuel Okoro',
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Development',
    thumbnail: 'https://picsum.photos/seed/react/800/450'
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the principles of user interface and experience design for mobile and web.',
    instructor: 'Kofi Mensah',
    duration: '8 weeks',
    level: 'Intermediate',
    category: 'Design',
    thumbnail: 'https://picsum.photos/seed/design/800/450'
  },
  {
    id: '5',
    title: 'Data Science with Python',
    description: 'Analyze data, build models, and visualize insights using Python and its ecosystem.',
    instructor: 'Dr. Elena Vance',
    duration: '16 weeks',
    level: 'Advanced',
    category: 'Data Science',
    thumbnail: 'https://picsum.photos/seed/data/800/450'
  }
];

const Courses = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <header className="space-y-4">
        <h1 className="text-4xl font-display italic text-slate-900">Courses</h1>
        <p className="text-slate-600 max-w-2xl">
          High-quality courses designed for you to learn at your own pace and earn certifications. 
          
        </p>
      </header>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['All', 'Computer Literacy', 'Development', 'Design', 'Data Science', 'Marketing', 'Product Development'].map(cat => (
          <button 
            key={cat}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:border-emerald-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_COURSES.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <BarChart size={14} /> {course.level}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} /> {course.duration}
                </div>
              </div>

              <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                {course.title}
              </h3>
              
              <p className="text-slate-600 text-sm line-clamp-2">
                {course.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-100 rounded-full" />
                  <span className="text-xs font-medium text-slate-500">{course.instructor}</span>
                </div>
                <button className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Enroll <PlayCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
