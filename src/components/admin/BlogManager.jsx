import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, FileText, Save, X, Globe, Image as ImageIcon } from 'lucide-react';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Dicas',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchPosts();
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
      toast.error('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData({ 
      ...formData, 
      title, 
      slug,
      meta_title: title // Default meta title to post title
    });
  };

  const openModal = (post = null) => {
    if (post) {
      setFormData(post);
      setEditingId(post.id);
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: 'Dicas',
        meta_title: '',
        meta_description: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success('Imagem carregada!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao subir imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Post atualizado!');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData]);
        if (error) throw error;
        toast.success('Post criado!');
      }
      closeModal();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Erro ao salvar post. Verifique se o slug é único.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Post excluído!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erro ao excluir post');
    }
  };

  if (loading) return <div>Carregando blog...</div>;

  return (
    <div className="blog-manager">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>Gerenciar Blog (SEO)</h3>
          <button onClick={() => openModal()} className="admin-btn admin-btn-accent">
            <Plus size={18} /> Novo Artigo
          </button>
        </div>

        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '1rem' }}>Capa</th>
                <th style={{ padding: '1rem' }}>Título</th>
                <th style={{ padding: '1rem' }}>Categoria</th>
                <th style={{ padding: '1rem' }}>URL (Slug)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>
                    <img src={post.image_url || 'https://via.placeholder.com/150'} alt={post.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{post.title}</td>
                  <td style={{ padding: '1rem' }}>{post.category}</td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748b' }}>/blog/{post.slug}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(post)} className="admin-btn" style={{ padding: '0.4rem', color: '#6366f1' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(post.id)} className="admin-btn" style={{ padding: '0.4rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    Nenhum post encontrado. Escreva sua primeira matéria!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{editingId ? 'Editar Artigo' : 'Novo Artigo'}</h3>
              <button onClick={closeModal} className="admin-btn"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Título da Matéria</label>
                  <input required className="form-input" value={formData.title} onChange={handleTitleChange} placeholder="Título chamativo..." />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Categoria</label>
                  <select className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Dicas">Dicas</option>
                    <option value="Notícias">Notícias</option>
                    <option value="Roteiros">Roteiros</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Slug (URL do Post)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>agenteembonito.com.br/blog/</span>
                  <input required className="form-input" value={formData.slug} onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})} />
                </div>
              </div>

              <div className="form-group">
                <label>Resumo (Excerpt)</label>
                <textarea className="form-input" rows="2" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} placeholder="Breve introdução para a listagem..." />
              </div>

              <div className="form-group">
                <label>Conteúdo da Matéria (Markdown/HTML)</label>
                <textarea required className="form-input" rows="10" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Escreva o conteúdo completo aqui..." />
              </div>

              <div className="form-group">
                <label>Imagem de Capa</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '150px', height: '100px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    {formData.image_url ? <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.2 }}>🖼️</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-btn" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                      {uploading ? 'Carregando...' : 'Carregar Foto'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                    <input className="form-input" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} placeholder="Ou URL da imagem" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', border: '1px solid #e2e8f0' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#1e293b' }}>
                  <Globe size={18} /> Configurações de SEO (Google)
                </h4>
                <div className="form-group">
                  <label>Meta Title (Título no Google)</label>
                  <input className="form-input" value={formData.meta_title} onChange={(e) => setFormData({...formData, meta_title: e.target.value})} placeholder="Máximo 60 caracteres recomendado" />
                </div>
                <div className="form-group">
                  <label>Meta Description (Descrição no Google)</label>
                  <textarea className="form-input" rows="2" value={formData.meta_description} onChange={(e) => setFormData({...formData, meta_description: e.target.value})} placeholder="Máximo 160 caracteres recomendado" />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={closeModal} className="admin-btn">Cancelar</button>
                <button type="submit" className="admin-btn admin-btn-accent" disabled={uploading}>
                  <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Publicar Matéria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
