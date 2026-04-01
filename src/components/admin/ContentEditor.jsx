import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, RefreshCw, Upload, Image as ImageIcon, Layout, Compass, Video, Truck, Mail } from 'lucide-react';

const ContentEditor = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const heroImageUrl = watch('hero_image_url');
  const logoUrl = watch('logo_url');

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

      if (error) throw error;
      if (data) reset(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const isTransport = field.startsWith('transport_');
      const folder = field === 'logo_url' ? 'brand' : (isTransport ? 'transport' : 'hero');
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setValue(field, publicUrl);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao subir imagem');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      
      // Filter out temporary UI fields that are not in the database
      const { 
        primary_color_1, primary_color_2, 
        hero_title_color_1, hero_title_color_2, 
        ...dataToSave 
      } = formData;

      // Ensure numeric types are correctly cast
      if (dataToSave.logo_height) {
        dataToSave.logo_height = parseInt(dataToSave.logo_height, 10);
      }

      const { error } = await supabase
        .from('site_settings')
        .update(dataToSave)
        .eq('id', formData.id);

      if (error) throw error;
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(`Erro: ${error.message || 'Verifique se as colunas existem no banco.'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Carregando...</div>;

  return (
    <div className="content-editor">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Editor do Hero (Banner)</h3>
            <button type="button" onClick={fetchSettings} className="admin-btn"><RefreshCw size={16} /></button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Título para Site/SEO (Geral)</label>
              <input {...register('hero_title')} className="form-input" placeholder="Ex: A Gente em Bonito - Agência de Ecoturismo" />
            </div>
            <div className="form-group">
              <label>Subtítulo</label>
              <input {...register('hero_subtitle')} className="form-input" placeholder="Breve frase de efeito" />
            </div>

            <div className="form-group">
              <label>Título Superior (Texto Pequeno)</label>
              <input {...register('hero_title_top')} className="form-input" placeholder="Ex: A GENTE EM" />
            </div>
            <div className="form-group">
              <label>TEXTO CENTRAL (EX: BONITO)</label>
              <input {...register('hero_title_main')} className="form-input" placeholder="Ex: BONITO" />
            </div>
            
            <div className="form-group">
              <label>Cor do Texto Central (Opcional)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" {...register('hero_title_color')} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
                <input {...register('hero_title_color')} className="form-input" style={{ flex: 1 }} placeholder="#RRGGBB" />
              </div>
            </div>

            <div className="form-group">
              <label>Texto Botão 1</label>
              <input {...register('hero_btn1_text')} className="form-input" placeholder="Ex: Explorar Pacotes" />
            </div>
            <div className="form-group">
              <label>Texto Botão 2</label>
              <input {...register('hero_btn2_text')} className="form-input" placeholder="Ex: Assistir Vídeo" />
            </div>
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Imagem do Banner</label>
              <div className="image-upload-wrapper" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative', height: '200px', backgroundColor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {heroImageUrl ? (
                      <img src={heroImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <ImageIcon size={48} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p>Nenhuma imagem selecionada</p>
                      </div>
                    )}
                    {uploading && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Subindo...</div>}
                  </div>
                </div>
                
                <div style={{ width: '250px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Recomendado: 1920x1080px. Formatos aceitos: JPG, PNG, WEBP.</p>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                    <Upload size={18} /> {uploading ? 'Carregando...' : 'Subir Nova Foto'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image_url')} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ou cole o link direto:</label>
                    <input {...register('hero_image_url')} className="form-input" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Gradients and Colors Section */}
            <div className="form-group" style={{ gridColumn: 'span 2', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1.2rem', color: '#1e293b', fontWeight: 600 }}>Cores Dinâmicas e Degradê</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                {/* Primary Button Color */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cor do Botão (Principal)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input {...register('primary_color')} type="color" className="form-input" style={{ width: '45px', padding: '2px' }} />
                    <input {...register('primary_color')} className="form-input" style={{ flex: 1, fontSize: '0.8rem' }} placeholder="#00f2fe ou linear-gradient(...)" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', backgroundColor: '#fff', padding: '0.8rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Gerador de Degradê:</span>
                    <input type="color" defaultValue="#00f2fe" onChange={(e) => {
                      const c2 = watch('primary_color_2') || '#4facfe';
                      setValue('primary_color', `linear-gradient(to right, ${e.target.value}, ${c2})`);
                      setValue('primary_color_1', e.target.value);
                    }} style={{ width: '28px', height: '28px', padding: 0, cursor: 'pointer' }} title="Cor Inicial" />
                    <input type="color" defaultValue="#4facfe" onChange={(e) => {
                      const c1 = watch('primary_color_1') || '#00f2fe';
                      setValue('primary_color', `linear-gradient(to right, ${c1}, ${e.target.value})`);
                      setValue('primary_color_2', e.target.value);
                    }} style={{ width: '28px', height: '28px', padding: 0, cursor: 'pointer' }} title="Cor Final" />
                    <button type="button" onClick={() => setValue('primary_color', '#00f2fe')} style={{ marginLeft: 'auto', background: '#e2e8f0', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}>Reset Cor Sólida</button>
                  </div>
                </div>

                {/* Hero Title Color */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cor do Nome (BONITO)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input {...register('hero_title_color')} type="color" className="form-input" style={{ width: '45px', padding: '2px' }} />
                    <input {...register('hero_title_color')} className="form-input" style={{ flex: 1, fontSize: '0.8rem' }} placeholder="#ffffff ou linear-gradient(...)" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', backgroundColor: '#fff', padding: '0.8rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Gerador de Degradê:</span>
                    <input type="color" defaultValue="#ffffff" onChange={(e) => {
                      const c2 = watch('hero_title_color_2') || '#00f2fe';
                      setValue('hero_title_color', `linear-gradient(to right, ${e.target.value}, ${c2})`);
                      setValue('hero_title_color_1', e.target.value);
                    }} style={{ width: '28px', height: '28px', padding: 0, cursor: 'pointer' }} title="Cor Inicial" />
                    <input type="color" defaultValue="#00f2fe" onChange={(e) => {
                      const c1 = watch('hero_title_color_1') || '#ffffff';
                      setValue('hero_title_color', `linear-gradient(to right, ${c1}, ${e.target.value})`);
                      setValue('hero_title_color_2', e.target.value);
                    }} style={{ width: '28px', height: '28px', padding: 0, cursor: 'pointer' }} title="Cor Final" />
                    <button type="button" onClick={() => setValue('hero_title_color', '#ffffff')} style={{ marginLeft: 'auto', background: '#e2e8f0', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}>Reset Cor Sólida</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Cor do Subtítulo</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input {...register('hero_subtitle_color')} type="color" className="form-input" style={{ width: '60px', padding: '2px' }} />
                <input {...register('hero_subtitle_color')} className="form-input" placeholder="rgba(255,255,255,0.9)" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>WhatsApp de Contato</label>
              <input {...register('whatsapp_number')} className="form-input" placeholder="Ex: 5567999999999" />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <div className="admin-card-header">
            <h3>Personalização Visual (Logo)</h3>
            <div className="form-group">
              <label>Cor do Título</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" {...register('about_title_color')} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'none' }} />
                <input {...register('about_title_color')} className="form-input" placeholder="#000000" />
              </div>
            </div>
          </div>

          {/* Seção de Galeria */}
          <div className="section-header-admin">
            <ImageIcon size={20} />
            <h3>Seção de Galeria (Home)</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Título da Seção</label>
              <input {...register('gallery_title')} className="form-input" />
            </div>
            <div className="form-group">
              <label>Subtítulo da Seção</label>
              <input {...register('gallery_subtitle')} className="form-input" />
            </div>
            <div className="form-group">
              <label>Cor do Título</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" {...register('gallery_title_color')} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'none' }} />
                <input {...register('gallery_title_color')} className="form-input" placeholder="#000000" />
              </div>
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>Logo da Marca (PNG Transparente Recomendado)</label>
            <div className="image-upload-wrapper" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              <div style={{ width: '140px' }}>
                <div style={{ position: 'relative', height: '140px', backgroundColor: '#334155', borderRadius: '12px', overflow: 'hidden', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <ImageIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                      <p style={{ fontSize: '0.7rem' }}>Sem Logo</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Esta logo aparecerá no cabeçalho e no rodapé do site. Use arquivos PNG com fundo transparente para melhor resultado.</p>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Tamanho da Logo (Altura): <span>{watch('logo_height') || 40}px</span>
                  </label>
                  <input 
                    {...register('logo_height')} 
                    type="range" 
                    min="20" 
                    max="120" 
                    className="form-input" 
                    style={{ padding: 0, height: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', flex: 1, justifyContent: 'center' }}>
                    <Upload size={18} /> {uploading ? 'Carregando...' : 'Subir Logo'}
                    <input type="file" accept="image/png,image/svg+xml,image/webp" onChange={(e) => handleImageUpload(e, 'logo_url')} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  <div style={{ flex: 2 }}>
                    <input {...register('logo_url')} className="form-input" style={{ fontSize: '0.75rem' }} placeholder="Ou cole o link da logo..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <div className="admin-card-header">
            <h3>Sessão Quem Somos (Colaborador)</h3>
          </div>
          
          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Título da Seção</label>
              <input {...register('about_title')} className="form-input" placeholder="Ex: Nossa História, Quem Somos..." />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Descrição / História</label>
              <textarea 
                {...register('about_description')} 
                className="form-input" 
                style={{ minHeight: '150px', resize: 'vertical' }}
                placeholder="Conte um pouco sobre você ou sua agência..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Foto do Colaborador/Equipe</label>
              <div className="image-upload-wrapper" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <div style={{ width: '180px' }}>
                  <div style={{ position: 'relative', height: '240px', backgroundColor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {watch('about_image_url') ? (
                      <img src={watch('about_image_url')} alt="About Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <ImageIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.7rem' }}>Sem Foto</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Esta foto aparecerá em destaque na seção "Quem Somos". Recomendado: Foto vertical (3:4).</p>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                    <Upload size={18} /> {uploading ? 'Carregando...' : 'Subir Foto'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'about_image_url')} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ou cole o link direto:</label>
                    <input {...register('about_image_url')} className="form-input" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <div className="admin-card-header">
            <h3>Sessão Transporte (Vans e Diferenciais)</h3>
          </div>
          
          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Título da Seção</label>
              <input {...register('transport_title')} className="form-input" placeholder="Ex: VOCÊ PRECISA SABER" />
            </div>

            <div className="form-group">
              <label>Badge - Número/Destaque</label>
              <input {...register('transport_badge_number')} className="form-input" placeholder="Ex: 10+" />
            </div>
            <div className="form-group">
              <label>Badge - Texto</label>
              <input {...register('transport_badge_text')} className="form-input" placeholder="Ex: Anos de Experiência" />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Quadro 1 (Título e Descrição) - Ex: Frota Moderna</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input {...register('transport_f1_title')} className="form-input" style={{ flex: 1 }} placeholder="Título" />
                <input {...register('transport_f1_desc')} className="form-input" style={{ flex: 2 }} placeholder="Descrição" />
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.75rem' }} title="Subir Foto do Quadro">
                    <Upload size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'transport_f1_image_url')} style={{ display: 'none' }} />
                  </label>
                  {watch('transport_f1_image_url') && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓</div>}
                </div>
              </div>
              <textarea {...register('transport_f1_details')} className="form-input" style={{ width: '100%', minHeight: '80px', marginTop: '0.5rem' }} placeholder="Texto detalhado para o Quadro 1..." />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Quadro 2 (Título e Descrição) - Ex: Segurança Total</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input {...register('transport_f2_title')} className="form-input" style={{ flex: 1 }} placeholder="Título" />
                <input {...register('transport_f2_desc')} className="form-input" style={{ flex: 2 }} placeholder="Descrição" />
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.75rem' }} title="Subir Foto do Quadro">
                    <Upload size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'transport_f2_image_url')} style={{ display: 'none' }} />
                  </label>
                  {watch('transport_f2_image_url') && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓</div>}
                </div>
              </div>
              <textarea {...register('transport_f2_details')} className="form-input" style={{ width: '100%', minHeight: '80px', marginTop: '0.5rem' }} placeholder="Texto detalhado para o Quadro 2..." />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Quadro 3 (Título e Descrição) - Ex: Privativo...</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input {...register('transport_f3_title')} className="form-input" style={{ flex: 1 }} placeholder="Título" />
                <input {...register('transport_f3_desc')} className="form-input" style={{ flex: 2 }} placeholder="Descrição" />
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.75rem' }} title="Subir Foto do Quadro">
                    <Upload size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'transport_f3_image_url')} style={{ display: 'none' }} />
                  </label>
                  {watch('transport_f3_image_url') && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓</div>}
                </div>
              </div>
              <textarea {...register('transport_f3_details')} className="form-input" style={{ width: '100%', minHeight: '80px', marginTop: '0.5rem' }} placeholder="Texto detalhado para o Quadro 3..." />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Quadro 4 (Título e Descrição) - Ex: Pontualidade</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input {...register('transport_f4_title')} className="form-input" style={{ flex: 1 }} placeholder="Título" />
                <input {...register('transport_f4_desc')} className="form-input" style={{ flex: 2 }} placeholder="Descrição" />
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '0.75rem' }} title="Subir Foto do Quadro">
                    <Upload size={14} />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'transport_f4_image_url')} style={{ display: 'none' }} />
                  </label>
                  {watch('transport_f4_image_url') && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓</div>}
                </div>
              </div>
              <textarea {...register('transport_f4_details')} className="form-input" style={{ width: '100%', minHeight: '80px', marginTop: '0.5rem' }} placeholder="Texto detalhado para o Quadro 4..." />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Foto da Van/Frota</label>
              <div className="image-upload-wrapper" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <div style={{ width: '200px' }}>
                  <div style={{ position: 'relative', height: '140px', backgroundColor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {watch('transport_image_url') ? (
                      <img src={watch('transport_image_url')} alt="Transport Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <ImageIcon size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.7rem' }}>Sem Foto</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Esta foto aparecerá na seção de transporte. Use imagens PNG com fundo transparente ou fotos de alta qualidade.</p>
                  <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                    <Upload size={18} /> {uploading ? 'Carregando...' : 'Subir Foto'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'transport_image_url')} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ou cole o link direto:</label>
                    <input {...register('transport_image_url')} className="form-input" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '2rem', zIndex: 10 }}>
          <button type="submit" className="admin-btn admin-btn-accent" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} disabled={saving || uploading}>
            {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentEditor;
