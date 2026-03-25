export default function Showcase() {
  return (
    <section className="showcase" id="dashboard">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-16 px-4">
  {/* Badge Superior */}
  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-fade-in">
    Dashboard Inteligente
  </span>

  {/* Título com Gradiente */}
  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
    Acompanhe seu progresso <br className="hidden md:block" />
    <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
      em Tempo Real
    </span>
  </h2>

  {/* Subtítulo de Apoio */}
  <p className="max-w-2xl text-slate-400 text-lg md:text-xl leading-relaxed">
    Visualize sua evolução através de dados precisos. Nossa plataforma transforma seu esforço em métricas claras para acelerar sua aprovação.
  </p>

  {/* Linha Decorativa (Opcional) */}
  <div className="mt-8 h-1 w-24 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full opacity-50"></div>
</div>

        <div className="dashboard-preview">
          {/* Main Dashboard Card */}
          <div className="dashboard-card main-card">
            <div className="card-header">
              <h3>📊 Seu Dashboard Inteligente</h3>
              <div className="card-date">Última atualização: Hoje às 14h</div>
            </div>
            <div className="dashboard-grid">
              {/* Stats Overview */}
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-value">4000</div>
                  <div className="stat-label">Questões Resolvidas</div>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{ width: '87%' }}></div>
                  </div>
                  <div className="stat-percentage">87%</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">8.2</div>
                  <div className="stat-label">Nota Média (Cebraspe)</div>
                  <div className="stat-progress">
                    <div className="progress-bar success" style={{ width: '82%' }}></div>
                  </div>
                  <div className="stat-percentage">82%</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">15</div>
                  <div className="stat-label">Dias de Sequência</div>
                  <div className="stat-progress">
                    <div className="progress-bar warning" style={{ width: '68%' }}></div>
                  </div>
                  <div className="stat-percentage">68 dias record</div>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="subjects-section">
                <h4>📚 Desempenho por Matéria</h4>
                <div className="subject-bars">
                  <div className="subject-bar">
                    <div className="subject-name">Informática Forense</div>
                    <div className="bar-container">
                      <div className="bar-fill green" style={{ width: '92%' }}></div>
                    </div>
                    <div className="bar-value">92% ✅ CONSOLIDADO</div>
                  </div>
                  <div className="subject-bar">
                    <div className="subject-name">Redes de Computadores</div>
                    <div className="bar-container">
                      <div className="bar-fill yellow" style={{ width: '68%' }}></div>
                    </div>
                    <div className="bar-value">68% 🚨 REFORÇAR</div>
                  </div>
                  <div className="subject-bar">
                    <div className="subject-name">Banco de Dados</div>
                    <div className="bar-container">
                      <div className="bar-fill green" style={{ width: '85%' }}></div>
                    </div>
                    <div className="bar-value">85% ✅ CONSOLIDADO</div>
                  </div>
                  <div className="subject-bar">
                    <div className="subject-name">Engenharia de Software</div>
                    <div className="bar-container">
                      <div className="bar-fill blue" style={{ width: '78%' }}></div>
                    </div>
                    <div className="bar-value">78% 📈 Progredindo</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-section">
                <h4>⚡ Próximas Revisões (Active Recall)</h4>
                <div className="activity-items">
                  <div className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-text">
                      <div className="activity-title">Revisar: Criptografia Assimétrica</div>
                      <div className="activity-time">Hoje às 16h</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot warning"></div>
                    <div className="activity-text">
                      <div className="activity-title">Revisar: SQL Avançado</div>
                      <div className="activity-time">Amanhã às 10h</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-text">
                      <div className="activity-title">Simulado Completo: Perito PF</div>
                      <div className="activity-time">Em 3 dias</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="features-highlights">
            <div className="feature-highlight-item">
              <div className="feature-icon">📈</div>
              <div className="feature-text">
                <h4>Análise Profunda</h4>
                <p>Gráficos e métricas que revelam seus padrões de aprendizado</p>
              </div>
            </div>
            <div className="feature-highlight-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h4>Metas Personalizadas</h4>
                <p>O sistema se adapta ao seu ritmo e objetivos</p>
              </div>
            </div>
            <div className="feature-highlight-item">
              <div className="feature-icon">🔔</div>
              <div className="feature-text">
                <h4>Notificações Inteligentes</h4>
                <p>Alertas no momento exato para máxima efetividade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .showcase {
          padding: 100px 0;
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
        }

        .dashboard-preview {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .dashboard-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(51, 65, 85, 0.3);
        }

        .card-header h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .card-date {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-box {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.3);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #10b981;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .stat-progress {
          width: 100%;
          height: 8px;
          background: rgba(51, 65, 85, 0.3);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-bar.success {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .progress-bar.warning {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .stat-percentage {
          font-size: 0.8rem;
          color: #64748b;
        }

        .subjects-section {
          margin-top: 20px;
        }

        .subjects-section h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 15px;
        }

        .subject-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subject-bar {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .subject-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .bar-container {
          width: 100%;
          height: 10px;
          background: rgba(51, 65, 85, 0.3);
          border-radius: 5px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.5s ease;
        }

        .bar-fill.green {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .bar-fill.yellow {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .bar-fill.blue {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .bar-value {
          font-size: 0.8rem;
          color: #cbd5e1;
          font-weight: 500;
        }

        .activity-section {
          margin-top: 20px;
        }

        .activity-section h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 15px;
        }

        .activity-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }

        .activity-dot {
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .activity-dot.warning {
          background: #f59e0b;
        }

        .activity-text {
          flex: 1;
        }

        .activity-title {
          font-size: 0.95rem;
          color: #e2e8f0;
          font-weight: 600;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 3px;
        }

        .features-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .feature-highlight-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 14px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .feature-text h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 4px;
        }

        .feature-text p {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .dashboard-card {
            padding: 24px;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}