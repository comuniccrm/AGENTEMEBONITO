import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './FluidGallery.css';

const FluidGallery = ({ items }) => {
  const containerRef = useRef(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const defaultItems = [
    { image: `https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80`, text: 'Bonito' },
    { image: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80`, text: 'Aventura' },
    { image: `https://images.unsplash.com/photo-1499244571948-7cc805d41549?q=80`, text: 'Energia' },
    { image: `https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80`, text: 'Natureza' },
    { image: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80`, text: 'Paz' },
    { image: `https://images.unsplash.com/photo-1499244571948-7cc805d41549?q=80`, text: 'Vida' }
  ];

  const galleryItems = items && items.length ? items : defaultItems;

  return (
    <div className="fluid-gallery-wrapper">
      <motion.div 
        ref={containerRef}
        className="fluid-gallery-viewport"
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="fluid-gallery-track">
          {galleryItems.map((item, index) => (
            <motion.div 
              key={index}
              className="fluid-gallery-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="item-image-wrapper glass">
                <img src={item.image} alt={item.text} loading="lazy" />
                <div className="item-overlay">
                  <span className="item-text">{item.text}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FluidGallery;
