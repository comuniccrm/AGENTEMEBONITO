import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import GradualBlur from './GradualBlur';
import Button from './Button';
import { AwardBadge } from './ui/award-badge';
import TextPressure from './ui/TextPressure';
import './Hero.css';

const Hero = () => {
  const { settings, loading } = useSite();

  if (loading) return (
    <div style={{ height: '100vh', width: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <section className="hero" style={{ 
      backgroundImage: `url("${settings.hero_image_url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#000'
    }}>
      <div className="hero-overlay"></div>

      <div className="hero-badge-container">
        <AwardBadge className="hero-official-badge" />
      </div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           style={{ marginBottom: '2rem', width: '100%', maxWidth: '1200px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.7)', 
              textTransform: 'uppercase',
              letterSpacing: '0.5em',
              marginBottom: '1rem'
            }}>
              {settings.hero_title_top || 'A Gente em'}
            </span>
            <div style={{ width: '100%', height: 'max(10rem, 20vw)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible' }}>
              <TextPressure 
                text={settings.hero_title_main || "BONITO"}
                fontFamily="Outfit"
                flex={true}
                scale={true}
                textColor={settings.hero_title_color || "var(--color-primary)"}
                minFontSize={60}
              />
            </div>
          </div>
          <p style={{ 
            fontSize: '1.5rem', 
            color: settings.hero_subtitle_color || "rgba(255,255,255,0.9)", 
            maxWidth: '600px', 
            margin: '2rem auto 0',
            fontWeight: 400
          }}>
            {settings.hero_subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => {
              const el = document.getElementById('pacotes');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {settings.hero_btn1_text || 'Explorar Pacotes'} <ArrowRight size={20} />
          </Button>
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => {
              const el = document.getElementById('videos360');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {settings.hero_btn2_text || 'Assistir Vídeo'} <Play size={20} fill="currentColor" />
          </Button>
        </motion.div>
      </div>

      <GradualBlur height="180px" />
    </section>
  );
};

export default Hero;
