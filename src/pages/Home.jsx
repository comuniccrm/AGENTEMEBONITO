import React, { Suspense, lazy } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import PureGlassBackground from '../components/PureGlassBackground';
import Footer from '../components/Footer';

const Packages = lazy(() => import('../components/Packages'));
const FluidGallery = lazy(() => import('../components/FluidGallery'));
const VideoGallery = lazy(() => import('../components/VideoGallery'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const TransportSection = lazy(() => import('../components/TransportSection'));

import { useSite } from '../context/SiteContext';

function Home() {
  const { settings } = useSite();
  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff' }}>
      <Navigation />
      <PureGlassBackground />
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        
        <Suspense fallback={<div style={{ height: '600px' }} />}>
          <Packages />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '400px' }} />}>
          <VideoGallery />
        </Suspense>
        
        <section id="destinations" style={{ padding: '6rem 0', textAlign: 'center', background: 'transparent', overflow: 'hidden' }}>
          <div className="container" style={{ marginBottom: '4rem', padding: '0 2rem' }}>
            <h2 className="section-title" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', color: settings.gallery_title_color || 'inherit' }}>
              {settings.gallery_title || 'Galeria'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              {settings.gallery_subtitle || 'Um vislumbre das belezas naturais que te esperam.'}
            </p>
          </div>
          
          <Suspense fallback={<div style={{ height: '500px' }} />}>
            <FluidGallery />
          </Suspense>
        </section>
        
        <Suspense fallback={<div style={{ height: '400px' }} />}>
          <AboutSection />
          <TransportSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}


export default Home;
