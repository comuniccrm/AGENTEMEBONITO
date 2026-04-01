import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    hero_title: 'A Gente em Bonito',
    hero_title_top: 'A GENTE EM',
    hero_title_main: 'BONITO',
    hero_btn1_text: 'Explorar Pacotes',
    hero_btn2_text: 'Assistir Vídeo',
    hero_subtitle: 'Experiências inesquecíveis no paraíso do ecoturismo.',
    hero_image_url: 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80&w=2070',
    primary_color: '#00f2fe',
    whatsapp_number: '5567999999999',
    logo_url: null,
    hero_title_color: '#ffffff',
    hero_subtitle_color: '#ffffff',
    logo_height: 40,
    about_title: 'Nossa História',
    about_description: 'Compartilhando o melhor de Bonito com você.',
    about_image_url: null,
    about_title_color: '#000000',
    transport_title: 'VOCÊ PRECISA SABER',
    transport_subtitle: 'TUDO O QUE VOCÊ PRECISA SABER',
    transport_title_color: '#000000',
    transport_image_url: '/tourism_van_bonito_transport_1774840720493.png',
    packages_title: 'Nossas Experiências',
    packages_subtitle: 'Movimentos leves e fluidos. O melhor de Bonito.',
    packages_title_color: '#000000',
    videos_title: 'Explore em Vídeo',
    videos_subtitle: 'Sinta a energia de Bonito através das nossas lentes.',
    videos_title_color: '#000000',
    contact_title: 'Fale Conosco',
    contact_subtitle: 'Estamos prontos para planejar sua viagem.',
    contact_title_color: '#000000',
    blog_title: 'Dicas e Novidades',
    blog_subtitle: 'Fique por dentro de tudo.',
    blog_title_color: '#000000',
    gallery_title: 'Galeria',
    gallery_subtitle: 'Um vislumbre das belezas naturais que te esperam.',
    gallery_title_color: '#000000',
    transport_badge_number: '10+',
    transport_badge_text: 'Anos de Experiência',
    transport_f1_title: 'Frota Moderna',
    transport_f1_desc: 'Vans e micro-ônibus novos, com ar-condicionado e poltronas reclináveis.',
    transport_f2_title: 'Segurança Total',
    transport_f2_desc: 'Motoristas experientes e veículos com revisões rigorosas em dia.',
    transport_f3_title: 'Privativo ou Compartilhado',
    transport_f3_desc: 'Escolha a opção que melhor se adapta ao seu grupo e orçamento.',
    transport_f4_title: 'Pontualidade',
    transport_f4_desc: 'Respeito total aos seus horários para você aproveitar cada minuto.',
    transport_f1_image_url: null,
    transport_f2_image_url: null,
    transport_f3_image_url: null,
    transport_f4_image_url: null,
    transport_f1_details: '',
    transport_f2_details: '',
    transport_f3_details: '',
    transport_f4_details: ''
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart functions
  const toggleCartItem = (pkg) => {
    setCart(prev => {
      const isSelected = prev.some(item => item.id === pkg.id);
      if (isSelected) {
        return prev.filter(item => item.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

  const clearCart = () => setCart([]);
  const isSelected = (id) => cart.some(item => item.id === id);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.warn('Using default settings (no data in DB yet)');
      } else if (data) {
        setSettings(data);
        // Apply primary color to CSS variables
        document.documentElement.style.setProperty('--color-primary', data.primary_color);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteContext.Provider value={{ 
      settings, 
      loading, 
      refreshSettings: fetchSettings,
      cart,
      toggleCartItem,
      clearCart,
      isSelected
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
