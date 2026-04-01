import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassSurface from '../components/GlassSurface';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#000000' }}>
      <Helmet>
        <title>Blog - A Gente Em Bonito | Dicas e Roteiros</title>
        <meta name="description" content="Descubra as melhores dicas, roteiros e notícias sobre Bonito-MS. Planeje sua viagem com quem entende da região." />
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
          <section className="blog-hero" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gradient" 
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              Blog & Dicas
            </motion.h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore nossos artigos para tornar sua experiência em Bonito inesquecível.
            </p>
          </section>

          <section className="blog-list" style={{ padding: '0 2rem 8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Carregando artigos...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {posts.map((post, index) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card"
                    style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={post.image_url || 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80'} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}>
                        {post.category}
                      </span>
                    </div>

                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} /> {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={14} /> {post.author || 'Equipe Bonito'}
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white', lineHeight: '1.3' }}>{post.title}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        {post.excerpt}
                      </p>

                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="text-gradient"
                        style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', textDecoration: 'none' }}
                      >
                        Ler Matéria <ArrowRight size={18} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                Ainda não temos matérias por aqui. Volte em breve!
              </div>
            )}
          </section>
        </GlassSurface>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
