import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './VideoGallery.css';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (index) => {
    setSelectedVideoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setSelectedVideoIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextVideo = (e) => {
    e.stopPropagation();
    setSelectedVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = (e) => {
    e.stopPropagation();
    setSelectedVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (loading) return null;
  
  // Sample content if DB is empty
  const displayVideos = videos.length > 0 ? videos : [
    { id: 's1', title: 'Explorando o Rio Sucuri', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4', thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070' },
    { id: 's2', title: 'Mergulho na Lagoa Misteriosa', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-divers-swimming-under-water-in-the-ocean-1563-large.mp4', thumbnail_url: 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80&w=2070' },
    { id: 's3', title: 'Trilha da Cachoeira', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-river-surrounded-by-forest-rocks-32608-large.mp4', thumbnail_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070' }
  ];

  return (
    <section id="videos360" className="video-section">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
        <h2 className="section-title" style={{ fontSize: '3rem', fontWeight: '900', color: settings.videos_title_color || 'inherit' }}>
          {settings.videos_title || 'Explore em Vídeo'}
        </h2>
        <p className="subtitle" style={{ fontSize: '1.2rem', color: '#64748b' }}>
          {settings.videos_subtitle || 'Sinta a energia de Bonito através das nossas lentes.'}
        </p>
      </div>

      <div className="shorts-container">
        <div className="shorts-scroll">
          {displayVideos.map((vid, index) => (
            <motion.div 
              key={vid.id}
              className="short-card"
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateY: 15 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateY: 0,
                transition: { 
                  type: "spring", 
                  bounce: 0.4, 
                  duration: 0.8,
                  delay: index * 0.1 
                } 
              }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ 
                scale: 1.05, 
                y: -15,
                transition: { duration: 0.3 }
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 3 + (index * 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              onClick={() => {
                setSelectedVideoIndex(index);
                setVideos(displayVideos); 
              }}
            >
              <div className="short-thumb glass">
                {vid.thumbnail_url ? (
                  <img src={vid.thumbnail_url} alt={vid.title} />
                ) : (
                  <div className="no-thumb">
                    <Play size={40} color="white" />
                  </div>
                )}
                <div className="short-overlay">
                  <div className="play-icon glass">
                    <Play size={24} fill="white" />
                  </div>
                </div>
              </div>
              <div className="short-info">
                <h3>{vid.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="full-video-overlay"
            onClick={closeVideo}
          >
            <div className="player-container" onClick={e => e.stopPropagation()}>
              <button className="close-player glass" onClick={closeVideo}><X size={24} /></button>
              
              <div className="video-wrapper">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayVideos[selectedVideoIndex].id}
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -50 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="video-content"
                  >
                    <video 
                      src={displayVideos[selectedVideoIndex].video_url}
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                    />
                    
                    <div className="player-controls-bottom">
                      <div className="video-info-player">
                        <span className="badge">Destaque</span>
                        <h4>{displayVideos[selectedVideoIndex].title}</h4>
                      </div>
                      <button className="mute-btn glass" onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>

                    {displayVideos.length > 1 && (
                      <div className="nav-controls">
                        <button className="nav-btn prev glass" onClick={prevVideo}><ChevronLeft size={24} /></button>
                        <button className="nav-btn next glass" onClick={nextVideo}><ChevronRight size={24} /></button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};


export default VideoGallery;
