import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Send, Trash2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Button from './Button';

const FloatingCart = () => {
  const { cart, toggleCartItem, clearCart, settings } = useSite();
  const [isOpen, setIsOpen] = React.useState(false);

  if (cart.length === 0) return null;

  const handleCheckout = () => {
    const tourList = cart.map(item => `• ${item.name}`).join('\n');
    const message = encodeURIComponent(
      `Olá! Gostaria de um orçamento para os seguintes passeios:\n\n${tourList}\n\nPor favor, me informe a disponibilidade e valores.`
    );
    window.open(`https://wa.me/${settings.whatsapp_number}?text=${message}`, '_blank');
  };

  return (
    <div className="floating-cart-wrapper" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="cart-panel glass"
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: 0,
              width: '320px',
              maxHeight: '450px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', fontWeight: 700 }}>Meus Passeios ({cart.length})</h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'white', opacity: 0.9 }}>{item.name}</span>
                  <button onClick={() => toggleCartItem(item)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Button variant="primary" onClick={handleCheckout} style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={18} style={{ marginRight: '8px' }} /> Pedir Orçamento
              </Button>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.4, fontSize: '0.8rem', cursor: 'pointer' }}>
                Limpar tudo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: 'black',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,242,254,0.4)',
          position: 'relative'
        }}
      >
        <ShoppingCart size={28} />
        {cart.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'white',
            color: 'black',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-primary)'
          }}>
            {cart.length}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingCart;
