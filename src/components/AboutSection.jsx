import React from 'react';
import { motion } from 'framer-motion';
import { useSite } from '../context/SiteContext';

const AboutSection = () => {
  const { settings } = useSite();

  return (
    <section className="about-section" id="about" style={{ padding: '6rem 2rem', background: 'var(--color-bg-darker)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="about-layout" style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'left', 
          gap: '5rem',
          flexWrap: 'wrap'
        }}>
          
          {/* Circular Photo with Rotating Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            style={{ position: 'relative', width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            {/* Rotating Text Wrapper */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', inset: -20, zIndex: 1 }}
            >
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <path
                  id="circlePath"
                  d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                  fill="transparent"
                />
                <text fill="#94a3b8" style={{ fontSize: '5.2px', fontWeight: 600, letterSpacing: '3.8px', textTransform: 'uppercase' }}>
                  <textPath xlinkHref="#circlePath">
                    • A GENTE EM BONITO • A GENTE EM BONITO • A GENTE EM BONITO 
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Inner Circular Photo */}
            <div style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '2px solid rgba(255,255,255,0.1)',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <img 
                src={settings.about_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976'} 
                alt="About Us" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' 
              }} />
            </div>

            {/* Decorative Glow */}
            <div style={{ 
              position: 'absolute', 
              width: '180px', 
              height: '180px', 
              background: 'var(--color-primary)', 
              borderRadius: '50%', 
              filter: 'blur(60px)', 
              opacity: 0.15, 
              zIndex: 0 
            }} />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ maxWidth: '500px', flex: 1 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: settings.about_title_color || '#64748b', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              {settings.about_title || 'Nossa História'}
            </h2>
            <div style={{ position: 'relative' }}>
              <p style={{ 
                color: '#64748b', 
                fontSize: '1.1rem', 
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                opacity: 0.9
              }}>
                {settings.about_description || 'Descreva aqui sua trajetoria e missao em Bonito.'}
              </p>
              
              <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Bonito</span>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Mato Grosso do Sul</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-layout {
            flex-direction: column !important;
            text-align: center !important;
            gap: 3rem !important;
          }
          .about-layout > div {
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
