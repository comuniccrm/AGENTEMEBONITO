import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassSurface from '../components/GlassSurface';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ background: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
      Carregando matéria...
    </div>
  );

  if (!post) return (
    <div style={{ background: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: 'white', marginBottom: '1rem' }}>Matéria não encontrada</h2>
      <Link to="/blog" className="admin-btn admin-btn-accent">Voltar ao Blog</Link>
    </div>
  );

  return (
    <div className="app-container" style={{ backgroundColor: '#000000' }}>
      <Helmet>
        <title>{post.meta_title || post.title} | A Gente Em Bonito</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:image" content={post.image_url} />
      </Helmet>

      <Navigation />

      <main style={{ paddingTop: '120px', minHeight: '80vh', background: 'transparent' }}>
        <GlassSurface
          displace={0.5}
          distortionScale={-220}
          redOffset={-20}
          greenOffset={-17}
          blueOffset={-6}
          brightness={25}
          opacity={0.25}
          mixBlendMode="screen"
        >
          <article style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 8rem 2rem' }}>
            
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Voltar ao Blog
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hero-image"
              style={{ width: '100%', height: '450px', borderRadius: '32px', overflow: 'hidden', marginBottom: '3rem', position: 'relative' }}
            >
              <img 
                src={post.image_url || 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80'} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(0,0,0,0.4)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '30px', backdropFilter: 'blur(10px)', fontSize: '0.9rem' }}>
                {post.category}
              </div>
            </motion.div>

            <header style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} /> {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} /> Escrito por Equipe Bonito
                </span>
              </div>
              
              <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '2rem', lineHeight: '1.2' }}>{post.title}</h1>
              
              <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: '1.6', borderLeft: '4px solid var(--color-primary)', paddingLeft: '2rem', margin: '2rem 0' }}>
                {post.excerpt}
              </p>
            </header>

            <div 
              className="blog-content" 
              style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '4rem' }}
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=Confira essa matéria: ${window.location.href}`, '_blank')}
                  className="admin-btn" style={{ gap: '0.5rem' }}
                >
                  <Share2 size={16} /> Compartilhar
                </button>
              </div>
              <Link to="/blog" className="text-gradient" style={{ fontWeight: '600', textDecoration: 'none' }}>Ver outras matérias em Bonito</Link>
            </div>

          </article>
        </GlassSurface>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;
