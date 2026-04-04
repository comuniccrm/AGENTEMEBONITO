import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';

// Admin Area - Lazy Loaded
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ContentEditor = lazy(() => import('./components/admin/ContentEditor'));
const PackageManager = lazy(() => import('./components/admin/PackageManager'));
const BlogManager = lazy(() => import('./components/admin/BlogManager.jsx'));
const VideoManager = lazy(() => import('./components/admin/VideoManager'));

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
          <Route path="/admin" element={
            <Suspense fallback={<div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>}>
              <AdminLayout />
            </Suspense>
          }>
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
