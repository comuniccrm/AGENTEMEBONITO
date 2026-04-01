import React, { useEffect, useState } from 'react';
import { Package, FileText, Image, MessageSquare, Video, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    packages: 0,
    videos: 0,
    settings: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: packageCount } = await supabase.from('packages').select('*', { count: 'exact', head: true });
    const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    
    setStats({
      packages: packageCount || 0,
      videos: videoCount || 0,
      settings: 1
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-stats">
        <div className="admin-stat-card" onClick={() => navigate('/admin/packages')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-info">
            <span>Pacotes de Viagem</span>
            <h3>{stats.packages}</h3>
          </div>
        </div>
        <div className="admin-stat-card" onClick={() => navigate('/admin/videos')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><Video size={24} /></div>
          <div className="stat-info">
            <span>Vídeos (Shorts)</span>
            <h3>{stats.videos}</h3>
          </div>
        </div>
        <div className="admin-stat-card" onClick={() => navigate('/admin/content')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon"><FileText size={24} /></div>
          <div className="stat-info">
            <span>Seções Editáveis</span>
            <h3>5</h3>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><MessageSquare size={24} /></div>
          <div className="stat-info">
            <span>Mensagens Suporte</span>
            <h3>0</h3>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Bem-vindo ao seu Painel</h3>
        </div>
        <p>Aqui você pode gerenciar todo o conteúdo do site "A Gente em Bonito". Use o menu lateral para navegar entre as seções.</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/admin/content')} className="admin-btn admin-btn-primary">Configurações Gerais</button>
          <button onClick={() => navigate('/admin/videos')} className="admin-btn admin-btn-accent">
            <Play size={18} /> Gerenciar Vídeos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
