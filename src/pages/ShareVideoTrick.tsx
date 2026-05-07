import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, MessageCircle, Heart, Share2, Download, Plus, Play, User } from 'lucide-react';

interface VideoTrick {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  downloads: number;
  createdAt: string;
}

const MOCK_VIDEOS: VideoTrick[] = [
  {
    id: '1',
    title: 'How to use Excel VLOOKUP like a pro',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://picsum.photos/seed/excel/800/450',
    author: 'DataMaster',
    likes: 124,
    comments: 18,
    shares: 45,
    downloads: 89,
    createdAt: '2026-04-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Quick fix for slow Wi-Fi on Android',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://picsum.photos/seed/wifi/800/450',
    author: 'AndroidExpert',
    likes: 89,
    comments: 12,
    shares: 23,
    downloads: 56,
    createdAt: '2026-04-14T15:30:00Z'
  }
];

const ShareVideoTrick = () => {
  const [videos, setVideos] = useState<VideoTrick[]>(MOCK_VIDEOS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const video: VideoTrick = {
      id: Date.now().toString(),
      title: newVideo.title,
      videoUrl: newVideo.url || 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: `https://picsum.photos/seed/${Date.now()}/800/450`,
      author: 'You',
      likes: 0,
      comments: 0,
      shares: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    };
    setVideos([video, ...videos]);
    setShowUploadModal(false);
    setNewVideo({ title: '', url: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          to="/tips-and-tricks" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Tips & Tricks
        </Link>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Share Video Trick
        </button>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-emerald-600">
          <Video size={32} />
          <h1 className="text-4xl font-display italic text-slate-900">Video Tricks</h1>
        </div>
        <p className="text-slate-600 max-w-2xl">
          Watch, learn, and share short video tutorials on digital skills and software hacks.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-xl transition-all group">
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
              <video 
                src={video.videoUrl} 
                poster={video.thumbnail}
                className="w-full h-full object-cover"
                controls
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-emerald-600 shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{video.author}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {video.title}
              </h3>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    <Heart size={18} /> <span className="text-xs font-bold">{video.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    <MessageCircle size={18} /> <span className="text-xs font-bold">{video.comments}</span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    <Share2 size={18} /> <span className="text-xs font-bold">{video.shares}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    <Download size={18} /> <span className="text-xs font-bold">{video.downloads}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Share a Video Trick</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <ArrowLeft size={24} className="rotate-90" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Trick Title</label>
                <input 
                  type="text" 
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="e.g. How to use VLOOKUP"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Video URL (Optional for demo)</label>
                <input 
                  type="url" 
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
              >
                Post Video Trick
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareVideoTrick;
