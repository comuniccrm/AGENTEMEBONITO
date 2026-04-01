import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import Button from './Button';
import './Tarifario.css';

const Tarifario = () => {
  return (
    <section className="tarifario" id="tarifario">
      <div className="tarifario-container">
        <motion.div 
          className="tarifario-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="tarifario-icon-wrapper glass">
            <FileText size={32} color="var(--color-primary)" />
          </div>
          <h2 className="section-title">Nosso <span className="text-gradient">Tarifário</span></h2>
          <p className="section-subtitle">Consulte os valores oficiais para o 1º Semestre de 2026. Planeje sua viagem para Bonito com antecedência e garanta as melhores opções.</p>
        </motion.div>

        <motion.div 
          className="tarifario-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="pdf-viewer glass-card">
            {/* Embed PDF inline */}
            <iframe 
              src="/tarifario.pdf#toolbar=0" 
              title="Tarifário 1º Semestre 2026"
              className="pdf-iframe"
            ></iframe>
          </div>

          <div className="tarifario-actions">
            <h3 className="tarifario-actions-title">Prefere baixar o arquivo completo?</h3>
            <p>Faça o download do PDF oficial para visualizar offline ou enviar para seus clientes/amigos.</p>
            <a href="/tarifario.pdf" download="Tarifario_A_Gente_Em_Bonito_2026.pdf" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              <Button variant="primary">
                <Download size={18} /> Baixar Tarifário em PDF
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Tarifario;
