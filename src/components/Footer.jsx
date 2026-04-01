import React from 'react';
import { Globe, Share2, MessageCircle, MapPin, Mail, Phone } from 'lucide-react';
import './Footer.css';

import { useSite } from '../context/SiteContext';

const Footer = () => {
  const { settings } = useSite();
  const formattedPhone = settings.whatsapp_number.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.hero_title} className="footer-logo mb-6" style={{ height: `${(settings.logo_height || 40) * 1.25}px`, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <h2 className="logo text-gradient mb-4">{settings.hero_title}</h2>
            )}
            <p className="footer-text">
              Transformando sua visita à capital do ecoturismo em uma experiência de luxo, conforto e total conexão com a natureza.
            </p>
            <div className="social-links mt-6">
              <a href="#" className="social-icon glass"><Globe size={20} /></a>
              <a href="#" className="social-icon glass"><Share2 size={20} /></a>
              <a href="#" className="social-icon glass"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3 className="footer-title">Navegação</h3>
            <div className="footer-links">
              <a href="#destinations">Destinos</a>
              <a href="#pacotes">Pacotes</a>
              <a href="#videos360">Vídeos 360°</a>
              <a href="#contact">Contato</a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3 className="footer-title">Suporte</h3>
            <div className="footer-links">
              <a href="#">FAQ</a>
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Uso</a>
              <a href="/admin">Área Admin</a>
            </div>
          </div>

          <div className="footer-contact">
            <h3 className="footer-title">Fale Conosco</h3>
            <div className="contact-item">
              <MapPin size={18} className="text-primary" />
              <span>Bonito - MS, Brasil</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="text-primary" />
              <span>{formattedPhone || settings.whatsapp_number}</span>
            </div>
            <div className="contact-item">
              <Mail size={18} className="text-primary" />
              <span>contato@agenteembonito.com.br</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings.hero_title}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
