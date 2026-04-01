import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!post) return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Matéria não encontrada</h2>
      <Link to="/blog" style={{ background: 'var(--color-primary)', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Voltar ao Blog</Link>
    </div>
  );

  const publishDate = new Date(post.published_at || post.created_at);

  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Helmet>
        <title>{post.meta_title || post.title} | A Gente Em Bonito</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:image" content={post.image_url} />
      </Helmet>

      {/* Navigation will stay dark because it has its own internal styling, we'll just push the main content down */}
      <div style={{ background: '#000000', height: '80px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}></div>
      <Navigation />

      <main style={{ paddingTop: '100px', backgroundColor: '#ffffff', color: '#1e293b', fontFamily: '"Inter", "Roboto", sans-serif' }}>
        
        {/* Cover Image Header */}
        <div style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '400px', backgroundColor: '#e2e8f0', backgroundImage: `url(${post.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <span style={{ display: 'inline-block', background: 'var(--color-primary)', color: '#000', padding: '0.4rem 1rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {post.category}
            </span>
            <h1 style={{ color: '#ffffff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', fontWeight: '800', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {post.title}
            </h1>
          </div>
        </div>

        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 8rem 2rem' }}>
          
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Voltar ao Blog
          </Link>

          <header style={{ marginBottom: '3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem' }}>
            <p style={{ fontSize: '1.4rem', color: '#475569', lineHeight: '1.6', fontWeight: '400', marginBottom: '2rem' }}>
              {post.excerpt}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
                  <User size={18} color="var(--color-primary)" /> Por {post.author || 'Equipe Bonito'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {publishDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> {publishDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=Confira essa matéria: ${window.location.href}`, '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: 'none', padding: '0.6rem 1rem', borderRadius: '30px', cursor: 'pointer', color: '#334155', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                <Share2 size={16} /> Compartilhar
              </button>
            </div>
          </header>

          <div 
            className="blog-content-article" 
            style={{ 
              color: '#334155', 
              fontSize: '1.25rem', 
              lineHeight: '1.9', 
              marginBottom: '4rem',
              fontWeight: '400'
            }}
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />

          <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '3rem', textAlign: 'center' }}>
            <Link to="/blog" style={{ background: 'var(--color-primary)', color: '#000000', padding: '1rem 2.5rem', borderRadius: '40px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
              Ver outras matérias em Bonito
            </Link>
          </div>

        </article>
      </main>

      <Footer />
      
      {/* Global styles for blog content specifically to handle links, bold tags, etc inside the article */}
      <style dangerouslySetInnerHTML={{__html: `
        .blog-content-article h1, .blog-content-article h2, .blog-content-article h3 {
          color: #0f172a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .blog-content-article h2 {
          fontSize: 1.8rem;
        }
        .blog-content-article p {
          margin-bottom: 1.5rem;
        }
        .blog-content-article a {
          color: #0284c7;
          text-decoration: underline;
        }
        .blog-content-article strong {
          color: #0f172a;
          font-weight: 700;
        }
        .blog-content-article img {
          max-width: 100%;
          border-radius: 12px;
          margin: 2rem 0;
        }
      `}} />
    </div>
  );
};

export default PostDetail;
