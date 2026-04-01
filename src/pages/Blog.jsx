import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Helmet>
        <title>Blog - A Gente Em Bonito | Dicas e Roteiros</title>
        <meta name="description" content="Descubra as melhores dicas, roteiros e notícias sobre Bonito-MS. Planeje sua viagem com quem entende da região." />
      </Helmet>

      {/* Solid black header background to support the white text navigation */}
      <div style={{ background: '#000000', height: '80px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}></div>
      <Navigation />

      <main style={{ paddingTop: '120px', minHeight: '80vh', backgroundColor: '#f8fafc', paddingBottom: '6rem' }}>
        <section className="blog-hero" style={{ padding: '4rem 2rem 2rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: '800' }}
          >
            Blog & Dicas
          </motion.h1>
          <p style={{ color: '#475569', fontSize: '1.2rem', margin: '0 auto' }}>
            Dicas, novidades e os melhores roteiros para tornar sua experiência em Bonito inesquecível.
          </p>
        </section>

        <section className="blog-list" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
              {posts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={post.image_url || 'https://images.unsplash.com/photo-1544550581-5f7ce32f8641?q=80'} 
                        alt={post.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-primary)', color: '#000', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {post.category}
                      </span>
                    </div>

                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} /> {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: '500' }}>
                          <User size={14} color="var(--color-primary)" /> {post.author || 'Equipe Bonito'}
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#0f172a', lineHeight: '1.3', fontWeight: '700', wordBreak: 'break-word' }}>{post.title}</h2>
                      <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {post.excerpt}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#0284c7' }}>
                        Ler Matéria <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              Ainda não temos matérias por aqui. Volte em breve!
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
