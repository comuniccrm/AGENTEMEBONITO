import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ArrowLeft, Search, Star, X, ChevronLeft, ChevronRight, Clock, Compass, Info } from 'lucide-react';
import Button from './Button';
import StarBorder from './ui/StarBorder';
import { supabase } from '../lib/supabase';
import { useSite } from '../context/SiteContext';
import './Packages.css';

// Componente do Card Individual
const TourCard = ({ pkg, onClick, isSelected, onToggleSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    className={`package-card ${isSelected ? 'is-selected' : ''}`} 
    style={{ background: 'transparent', padding: 0, border: 'none', cursor: 'pointer', position: 'relative' }}
    onClick={onClick}
  >
    <div 
      className="selection-indicator" 
      onClick={(e) => {
        e.stopPropagation();
        onToggleSelect(pkg);
      }}
      style={{ 
        position: 'absolute', 
        top: '1rem', 
        right: '1rem', 
        zIndex: 5, 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255,255,255,0.2)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: isSelected ? 'black' : 'white',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 0 15px var(--color-primary)' : 'none'
      }}
    >
      {isSelected ? '✓' : '+'}
    </div>

    <StarBorder 
      color={isSelected ? "var(--color-primary)" : "rgba(255,255,255,0.1)"} 
      speed={isSelected ? "3s" : "6s"} 
      thickness={isSelected ? 16 : 12} 
      className="h-full w-full"
      style={{ borderRadius: '24px' }}
      innerClassName="glass flex flex-col h-full overflow-hidden"
    >
      <div className="card-image-wrapper">
        <img 
          src={pkg.image_url || 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80'} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80'; }}
          alt={pkg.name} 
          className="card-image" 
        />
        <div className="card-custom-badge glass" style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {pkg.category}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{pkg.name}</h3>
        <p className="card-description" style={{ minHeight: '80px', marginTop: '10px', fontSize: '0.85rem' }}>{pkg.description}</p>
        <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-price" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="price-label" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Valor Oficial:</span>
            <span className="price-value" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>R$ {pkg.price}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(pkg);
            }}
            className={`btn-select-mini ${isSelected ? 'active' : ''}`}
            style={{ 
              backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
              color: isSelected ? 'black' : 'var(--color-primary)',
              border: `1px solid var(--color-primary)`,
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isSelected ? 'Selecionado' : 'Selecionar'}
          </button>
        </div>
      </div>
    </StarBorder>
  </motion.div>
);

const PackageDetailModal = ({ pkg, isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [pkg?.id]);

  const images = pkg?.gallery?.length > 0 ? pkg.gallery : [pkg?.image_url];
  const { settings, toggleCartItem, isSelected } = useSite();

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!pkg) return null;

  const whatsappLink = `https://wa.me/${settings.whatsapp_number}?text=Olá! Gostaria de mais informações sobre o passeio: ${pkg.name}.`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            className="modal-content glass"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '1000px', maxHeight: '95vh', overflowY: 'auto', background: 'var(--color-bg-dark)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', padding: 0, display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-inner-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', minHeight: '600px' }}>
              {/* Photo Area */}
              <div style={{ position: 'relative', background: '#000', height: '100%', minHeight: '400px' }}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    src={images[activeImage]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </AnimatePresence>

                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                  <X size={20} color="#1e293b" />
                </button>

                {images.length > 1 && (
                  <>
                    <button onClick={handlePrev} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleNext} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ChevronRight size={24} />
                    </button>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                      {images.map((_, i) => (
                        <div key={i} style={{ width: i === activeImage ? '24px' : '8px', height: '8px', background: 'white', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Info Area */}
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', color: 'white' }}>
                <span className="text-gradient" style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{pkg.category}</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '1rem 0', lineHeight: '1.1' }}>{pkg.name}</h2>
                
                <div style={{ display: 'flex', gap: '2rem', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} /> {pkg.duration || '02:00h'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={18} /> Moderado
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem 0 1rem 0', color: 'var(--color-primary)' }}><Info size={18} /> Detalhes da Experiência</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    {pkg.long_description || pkg.description}
                  </p>
                </div>

                <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Valor Oficial:</span>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>R$ {pkg.price}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button 
                      variant="outline" 
                      onClick={() => toggleCartItem(pkg)}
                      style={{ 
                        borderColor: isSelected(pkg.id) ? 'var(--color-primary)' : 'white',
                        color: isSelected(pkg.id) ? 'var(--color-primary)' : 'white'
                      }}
                    >
                      {isSelected(pkg.id) ? 'Remover da Lista' : 'Selecionar Passeio'}
                    </Button>
                    <Button variant="primary" onClick={() => window.open(whatsappLink, '_blank')}>
                      Reservar Individualmente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente da Tela Completa (Filtros)
const AllToursView = ({ packages, onBack, onPackageClick }) => {
  const [filter, setFilter] = useState('Todos');
  const { toggleCartItem, isSelected } = useSite();
  const categories = ['Todos', 'Passeio', 'Hospedagem', 'Combo', 'Cachoeira', 'Flutuação', 'Trilha', 'Fervedouro', 'Geral'];

  const filtered = filter === 'Todos' 
    ? packages 
    : packages.filter(pkg => pkg.category === filter);

  return (
    <div className="all-tours-view">
      <div className="all-tours-header">
        <button onClick={onBack} className="back-button glass">
          <ArrowLeft size={20} /> Voltar para o Início
        </button>
        <h2 className="section-title">Catálogo <span className="text-gradient">Completo</span></h2>
        
        <div className="filter-container glass" style={{ marginTop: '2rem', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', borderRadius: '50px' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={filter} className="packages-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
        {filtered.map((pkg) => (
          <TourCard 
            key={pkg.id} 
            pkg={pkg} 
            onClick={() => onPackageClick(pkg)} 
            isSelected={isSelected(pkg.id)}
            onToggleSelect={toggleCartItem}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Componente Principal
const Packages = () => {
  const { settings, toggleCartItem, isSelected } = useSite();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTours, setShowAllTours] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const carousel = React.useRef();

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth / 2);
    }
  }, [packages, showAllTours]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  if (loading) return <div className="packages-loading">Carregando passeios...</div>;

  if (showAllTours) {
    return (
      <section className="packages all-tours-section" id="packages" style={{ paddingTop: '120px' }}>
        <div className="packages-container">
           <AllToursView packages={packages} onBack={() => setShowAllTours(false)} onPackageClick={openPackage} />
        </div>
        <PackageDetailModal pkg={selectedPackage} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>
    );
  }

  // Duplicamos para efeito infinito perfeito e suave
  const marqueeTours = [...packages, ...packages];

  return (
    <section className="packages" id="pacotes">
      <div className="packages-container" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <motion.div className="packages-header" style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: settings.packages_title_color || 'inherit' }}>
            {settings.packages_title || 'Nossas Experiências'}
          </h2>
          <p className="section-subtitle">
            {settings.packages_subtitle || 'Movimentos leves e fluidos. O melhor de Bonito.'}
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Button 
              variant="outline" 
              className="glass"
              onClick={() => setShowAllTours(true)} 
              style={{ padding: '0.8rem 2.5rem', borderRadius: '50px' }}
            >
              Ver Catálogo Completo <Search size={18} style={{ marginLeft: '8px' }}/>
            </Button>
          </div>
        </motion.div>

        {packages.length > 0 ? (
          <>
            <div className="carousel-container">
              <motion.div 
                ref={carousel}
                className="carousel-track"
                animate={{ x: [0, -width] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25, 
                    ease: "linear",
                  },
                }}
                whileHover={{ animationPlayState: 'paused' }}
                style={{ display: 'flex' }}
              >
                {marqueeTours.map((pkg, index) => (
                  <motion.div 
                    className="carousel-item" 
                    key={`${pkg.id}-${index}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{
                      y: {
                        duration: 4 + (index % 3),
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <TourCard 
                      pkg={pkg} 
                      onClick={() => openPackage(pkg)} 
                      isSelected={isSelected(pkg.id)}
                      onToggleSelect={toggleCartItem}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="carousel-footer" style={{ display: 'none' }}>
            </div>
          </>
        ) : (
          <div className="no-results" style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Nenhum pacote disponível no momento. Adicione alguns no painel de admin!</p>
          </div>
        )}
      </div>

      <PackageDetailModal 
        pkg={selectedPackage} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default Packages;

