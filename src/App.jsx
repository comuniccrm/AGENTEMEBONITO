import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ContentEditor from './components/admin/ContentEditor';
import PackageManager from './components/admin/PackageManager';
import BlogManager from './components/admin/BlogManager.jsx';
import VideoManager from './components/admin/VideoManager';
import { Toaster } from 'sonner';
import FloatingCart from './components/FloatingCart';
import './App.css';

import { HelmetProvider } from 'react-helmet-async';
import { SiteProvider } from './context/SiteContext';

function App() {
  return (
    <HelmetProvider>
      <SiteProvider>
        <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Site */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          
          {/* Admin Area */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="packages" element={<PackageManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="videos" element={<VideoManager />} />
          </Route>
        </Routes>
        <FloatingCart />
      </Router>
      </SiteProvider>
    </HelmetProvider>
  );
}

export default App;
