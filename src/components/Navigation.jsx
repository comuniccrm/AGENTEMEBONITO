import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navigation.css';
import Button from './Button';
import GlassSurface from './GlassSurface';

import { useSite } from '../context/SiteContext';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSite();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp_number}?text=Olá! Gostaria de agendar uma viagem para Bonito.`;

  return (
    <nav className={`navigation ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-glass-wrapper">
        <GlassSurface
          className="nav-glass-bg"
          displace={scrolled ? 0.5 : 0}
          distortionScale={-220}
          redOffset={-20}
          greenOffset={-17}
          blueOffset={-6}
          brightness={25}
          opacity={scrolled ? 0.25 : 0}
          mixBlendMode="screen"
          borderRadius={48}
        />
      </div>

      <div className="nav-container">
        <Link to="/" className="logo">
          {settings.logo_url ? <img src={settings.logo_url} alt="Logo" style={{ height: `${settings.logo_height || 40}px` }} /> : 'A Gente Em Bonito'}
        </Link>
        
        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link">Início</Link>
          <a href="/#destinations" className="nav-link">Destinos</a>
          <a href="/#pacotes" className="nav-link">Pacotes</a>
          <Link to="/blog" className="nav-link">Blog</Link>
          <a href="/#contact" className="nav-link">Contato</a>
        </div>

        <div className="nav-actions desktop-only">
          <Button variant="primary" onClick={() => window.open(whatsappLink, '_blank')}>
            Agendar Viagem
          </Button>
        </div>

        <button 
          className="mobile-menu-btn mobile-only text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-menu glass"
        >
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Início</Link>
          <a href="/#destinations" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Destinos</a>
          <a href="/#pacotes" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pacotes</a>
          <Link to="/blog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <a href="/#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contato</a>
          <Button variant="primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => window.open(whatsappLink, '_blank')}>
            Agendar Viagem
          </Button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
