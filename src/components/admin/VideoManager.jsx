import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Video, X, Save, Film, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', video_url: '', thumbnail_url: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData(prev => ({ 
        ...prev, 
        [type === 'video' ? 'video_url' : 'thumbnail_url']: publicUrl 
      }));
      toast.success(`${type === 'video' ? 'Vídeo' : 'Thumbnail'} carregado!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('videos')
        .insert([formData]);
      if (error) throw error;
      toast.success('Vídeo adicionado!');
      setIsModalOpen(false);
      setFormData({ title: '', video_url: '', thumbnail_url: '' });
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Erro ao salvar vídeo (A tabela "videos" foi criada no Supabase?)');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este vídeo?')) return;
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Vídeo excluído');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erro ao excluir');
    }
  };

  if (loading) return <div className="p-8 text-white">Carregando vídeos...</div>;

  return (
    <div className="video-manager" style={{ padding: '2rem' }}>
      <div className="admin-card glass-card p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Vídeos & Shorts</h3>
            <p style={{ color: '#64748b' }}>Gerencie os vídeos verticais do site.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="admin-btn admin-btn-accent">
            <Plus size={18} /> Novo Vídeo
          </button>
        </div>

        <div className="video-grid-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {videos.map((vid) => (
            <div key={vid.id} className="video-item-card" style={{ overflow: 'hidden', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', transition: 'all 0.3s ease' }}>
              <div style={{ aspectRatio: '9/16', background: '#0f172a', position: 'relative' }}>
                {vid.thumbnail_url ? (
                  <img src={vid.thumbnail_url} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={vid.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                )}
                <button 
                  onClick={() => handleDelete(vid.id)} 
                  className="delete-video-btn" 
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 5 }}
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vid.title}</p>
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
              <Film size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <p style={{ color: '#64748b' }}>Nenhum vídeo cadastrado. Clique em "Novo Vídeo" para começar.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="admin-card" style={{ maxWidth: '500px', width: '100%', background: 'white', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Adicionar Novo Vídeo</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Título do Vídeo</label>
                <input required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Passeio no Rio Sucuri" />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Arquivo de Vídeo (Vertical 9:16)</label>
                <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', textAlign: 'center', borderRadius: '12px', background: '#f8fafc' }}>
                  {formData.video_url ? (
                    <div style={{ marginBottom: '1rem' }}>
                      <Video size={32} color="#10b981" style={{ margin: '0 auto' }} />
                      <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>Vídeo carregado com sucesso!</p>
                    </div>
                  ) : (
                    <Film size={32} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
                  )}
                  <label className="admin-btn" style={{ justifyContent: 'center', background: '#3b82f6', color: 'white', width: '100%', cursor: 'pointer', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {uploading ? 'Processando...' : 'Selecionar Vídeo'}
                    <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'video')} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Capa do Vídeo (Thumbnail)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '80px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    {formData.thumbnail_url ? <img src={formData.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}><ImageIcon size={24} /></div>}
                  </div>
                  <label className="admin-btn" style={{ flex: 1, background: '#f1f5f9', justifyContent: 'center', cursor: 'pointer', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Escolher Capa
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '700', cursor: 'pointer', opacity: (!formData.video_url || uploading) ? 0.5 : 1 }} disabled={!formData.video_url || uploading}>
                  <Save size={18} style={{ marginRight: '8px' }} /> Adicionar à Galeria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
