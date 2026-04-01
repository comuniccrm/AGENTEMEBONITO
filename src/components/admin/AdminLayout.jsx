import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Package, Home, LogOut, PenTool, Type, Video } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/content', icon: <FileText size={20} />, label: 'Conteúdo Site' },
    { path: '/admin/packages', icon: <Package size={20} />, label: 'Pacotes' },
    { path: '/admin/videos', icon: <Video size={20} />, label: 'Vídeos' },
    { path: '/admin/blog', icon: <Type size={20} />, label: 'Blog (SEO)' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Painel Admin</h2>
          <span>Bonito CMS</span>
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <Home size={20} />
            <span>Ver Site</span>
          </Link>
          <button className="admin-nav-item logout">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h1>
          <div className="admin-user">
            <span>Admin</span>
            <div className="avatar">A</div>
          </div>
        </header>
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
