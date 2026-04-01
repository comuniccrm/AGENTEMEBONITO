import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Package, Save, X } from 'lucide-react';

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Passeio',
    duration: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Erro ao carregar pacotes');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setFormData({
        ...pkg,
        gallery: pkg.gallery || [],
        long_description: pkg.long_description || ''
      });
      setEditingId(pkg.id);
    } else {
      setFormData({
        name: '',
        description: '',
        long_description: '',
        price: '',
        image_url: '',
        category: 'Passeio',
        duration: '',
        difficulty: '',
        gallery: []
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const newUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `packages/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        newUrls.push(publicUrl);
      }

      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }));
        toast.success(`${newUrls.length} fotos adicionadas à galeria!`);
      } else {
        setFormData(prev => ({ ...prev, image_url: newUrls[0] }));
        toast.success('Imagem principal carregada!');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao subir imagem(ns)');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, created_at, ...dataToSave } = formData;
      
      if (editingId) {
        const { error } = await supabase
          .from('packages')
          .update(dataToSave)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Pacote atualizado!');
      } else {
        const { error } = await supabase
          .from('packages')
          .insert([dataToSave]);
        if (error) throw error;
        toast.success('Pacote criado!');
      }
      closeModal();
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Erro ao salvar pacote');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este pacote?')) return;
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Pacote excluído!');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Erro ao excluir pacote');
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Carregando pacotes...</div>;

  return (
    <div className="package-manager">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>Catálogo de Pacotes</h3>
          <button onClick={() => openModal()} className="admin-btn admin-btn-accent">
            <Plus size={18} /> Novo Pacote
          </button>
        </div>

        <div className="packages-table-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '1rem' }}>Foto</th>
                <th style={{ padding: '1rem' }}>Nome</th>
                <th style={{ padding: '1rem' }}>Categoria</th>
                <th style={{ padding: '1rem' }}>Preço</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>
                    <img src={pkg.image_url || 'https://via.placeholder.com/50'} alt={pkg.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{pkg.name}</td>
                  <td style={{ padding: '1rem' }}>{pkg.category}</td>
                  <td style={{ padding: '1rem' }}>R$ {pkg.price}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(pkg)} className="admin-btn" style={{ padding: '0.4rem', color: '#6366f1' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(pkg.id)} className="admin-btn" style={{ padding: '0.4rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    Nenhum pacote encontrado. Comece criando um novo!
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
              <h3>{editingId ? 'Editar Pacote' : 'Novo Pacote'}</h3>
              <button onClick={closeModal} className="admin-btn"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Nome do Pacote</label>
                  <input required className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Categoria</label>
                  <select className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Passeio">Passeio</option>
                    <option value="Hospedagem">Hospedagem</option>
                    <option value="Combo">Combo</option>
                    <option value="Cachoeira">Cachoeira</option>
                    <option value="Flutuação">Flutuação</option>
                    <option value="Trilha">Trilha</option>
                    <option value="Fervedouro">Fervedouro</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Resumo (Breve descrição para a lista)</label>
                <textarea className="form-input" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Informações Completas (Aparece ao clicar no passeio)</label>
                <textarea className="form-input" rows="6" value={formData.long_description} onChange={(e) => setFormData({...formData, long_description: e.target.value})} placeholder="Descreva todos os detalhes, horários, o que levar..." />
              </div>

              <div className="form-group">
                <label>Foto Principal (Capa)</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '100px', height: '80px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    {formData.image_url ? <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.2 }}>🖼️</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-btn" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                      {uploading ? 'Carregando...' : 'Carregar Foto Capa'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Galeria de Fotos (Múltiplas fotos)</label>
                <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                    {formData.gallery && formData.gallery.map((url, i) => (
                      <div key={i} style={{ height: '60px', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: '1px solid #cbd5e1' }}>
                        <img src={url} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeGalleryImage(url)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    ))}
                    <label style={{ height: '60px', background: '#fff', borderRadius: '4px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', color: '#94a3b8' }}>
                      +
                      <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, true)} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Adicione todas as fotos que mostram os detalhes do passeio.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input type="number" step="0.01" className="form-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Duração (Ex: 02:30h)</label>
                  <input className="form-input" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={closeModal} className="admin-btn">Cancelar</button>
                <button type="submit" className="admin-btn admin-btn-accent" disabled={uploading}>
                  <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Criar Pacote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManager;
