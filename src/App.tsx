import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Opportunities from './pages/Opportunities';
import TipsAndTricks from './pages/TipsAndTricks';
import Mentorship from './pages/Mentorship';
import FindTechnician from './pages/FindTechnician';
import FindTrainer from './pages/FindTrainer';
import About from './pages/About';
import Events from './pages/Events';
import SearchResults from './pages/SearchResults';
import ShareVideoTrick from './pages/ShareVideoTrick';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path="tips-and-tricks" element={<TipsAndTricks />} />
          <Route path="share-video-trick" element={<ShareVideoTrick />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="find-technician" element={<FindTechnician />} />
          <Route path="find-trainer" element={<FindTrainer />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>
    </Router>
  );
}
