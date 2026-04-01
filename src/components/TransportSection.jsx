import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Shield, Clock, Star } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import './TransportSection.css';

const TransportSection = () => {
  const { settings } = useSite();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const features = [
    {
      icon: <Info className="w-6 h-6" />,
      title: settings.transport_f1_title || "Frota Moderna",
      description: settings.transport_f1_desc || "Vans e micro-ônibus novos, com ar-condicionado e poltronas reclináveis.",
      image: settings.transport_f1_image_url,
      details: settings.transport_f1_details || "Nossa frota é composta por veículos de última geração, equipados com ar-condicionado de alto desempenho e poltronas ergonômicas reclináveis, garantindo conforto total."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: settings.transport_f2_title || "Segurança Total",
      description: settings.transport_f2_desc || "Motoristas experientes e veículos com revisões rigorosas em dia.",
      image: settings.transport_f2_image_url,
      details: settings.transport_f2_details || "Segurança é prioridade. Todos os veículos passam por revisões semanais e nossos motoristas são certificados e treinados para atendimento turístico de excelência."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: settings.transport_f3_title || "Privativo ou Compartilhado",
      description: settings.transport_f3_desc || "Escolha a opção que melhor se adapta ao seu grupo e orçamento.",
      image: settings.transport_f3_image_url,
      details: settings.transport_f3_details || "Oferecemos flexibilidade total. O transporte compartilhado é ideal para economizar, enquanto o privativo oferece exclusividade de horários e roteiros."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: settings.transport_f4_title || "Pontualidade",
      description: settings.transport_f4_desc || "Respeito total aos seus horários para você aproveitar cada minuto.",
      image: settings.transport_f4_image_url,
      details: settings.transport_f4_details || "Sabemos que cada minuto conta. Por isso, operamos com rigorosa pontualidade em todos os traslados, garantindo que você chegue aos atrativos sempre no horário agendado."
    }
  ];

  const currentImage = features[selectedIndex]?.image || settings.transport_image_url || "/tourism_van_bonito_transport_1774840720493.png";

  return (
    <section className="transport-section" id="transporte">
      <div className="section-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header-centered"
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="section-title">
            {settings.transport_title?.split(' ')[0] || 'VOCÊ'}{' '}
            <span className="text-gradient">{settings.transport_title?.split(' ').slice(1).join(' ') || 'PRECISA SABER'}</span>
          </h2>
        </motion.div>

        <div className="transport-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="transport-content"
          >
            <div className="features-grid">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`feature-card ${selectedIndex === index ? 'active' : ''} ${isMobile && selectedIndex === index ? 'cascade-open' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-info">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    
                    {/* Mobile Cascade Details */}
                    <AnimatePresence>
                      {(isMobile && selectedIndex === index) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="mobile-details-content glass" style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '16px', fontSize: '0.9rem', border: '1px solid rgba(var(--color-primary-rgb), 0.1)' }}>
                            <p style={{ color: '#334155', lineHeight: '1.6' }}>{feature.details}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="transport-image-container"
          >
            <div className="image-glow"></div>
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedIndex}
                src={currentImage} 
                alt={features[selectedIndex]?.title || "Transporte"} 
                className="transport-van-image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            <div className="transport-badge">
              <span className="badge-number">{settings.transport_badge_number || '10+'}</span>
              <span className="badge-text">{settings.transport_badge_text || 'Anos de Experiência'}</span>
            </div>

            <AnimatePresence>
              {(!isMobile && features[selectedIndex]?.details) && (
                <motion.div 
                  key={`details-${selectedIndex}`}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="details-panel glass"
                >
                  <div className="details-header">
                    <Info size={20} className="text-primary" />
                    <h4>Detalhes do {features[selectedIndex]?.title}</h4>
                  </div>
                  <div className="details-content">
                    <p>{features[selectedIndex]?.details}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;
