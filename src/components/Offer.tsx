import { CheckCircle2, Zap, Target, Award } from 'lucide-react';

export default function Offer() {
  return (
    <section id="oferta" className="py-24 bg-[#030712] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="offer-wrapper">
          {/* Left Side - Benefits */}
          <div className="offer-benefits">
            <h2 className="section-title text-left mb-8">Tudo que você precisa para passar</h2>
            
            <div className="benefits-list">
              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Dashboard Completo</p>
                  <p className="text-slate-400 text-sm">Analytics em tempo real de seu desempenho</p>
                </div>
              </div>

              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">+10.000 Questões</p>
                  <p className="text-slate-400 text-sm">Base completa e verticalizada para Polícia Federal</p>
                </div>
              </div>

              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Active Recall Automático</p>
                  <p className="text-slate-400 text-sm">Revisões inteligentes no ciclo 1-7-30</p>
                </div>
              </div>

              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Simulador Cebraspe</p>
                  <p className="text-slate-400 text-sm">Cálculo de nota com o padrão real de correção</p>
                </div>
              </div>

              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Diagnóstico de Fraquezas</p>
                  <p className="text-slate-400 text-sm">IA identifica seus pontos fracos por matéria</p>
                </div>
              </div>

              <div className="benefit-row">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Acesso Vitalício</p>
                  <p className="text-slate-400 text-sm">Sem mensalidades, sem limites de tempo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pricing Card */}
          <div className="price-card">
            <div className="price-header">
              <span className="price-badge">OFERTA EXCLUSIVA</span>
            </div>

            <div className="price-content">
              <h3 className="text-2xl font-black text-white mb-4">Plano Completo</h3>
              
              <div className="price-display">
                <div className="price-original">De R$ 99,90</div>
                <div className="price-main">
                  <span className="price-currency">R$</span>
                  <span className="price-amount">29</span>
                  <span className="price-cents">,90</span>
                </div>
                <div className="price-interval">Pagamento único • Acesso para sempre</div>
              </div>

              <div className="features-inline">
                <div className="inline-feature">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Ativação Imediata</span>
                </div>
                <div className="inline-feature">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span>100% Verticalizado</span>
                </div>
                <div className="inline-feature">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>Suporte Prioritário</span>
                </div>
              </div>

              <button className="btn-cta-primary w-full">
                Começar Agora - Acesso Imediato
              </button>

              <p className="text-slate-400 text-xs text-center mt-4">
                ✓ Garantia de satisfação<br/>
                ✓ Sem compromisso de prazo<br/>
                ✓ Suporte via email 24h
              </p>
            </div>

            {/* Testimonial inside card */}
            
          </div>
        </div>
      </div>

      <style jsx>{`
        .offer-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .offer-badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 20px;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .offer-benefits {
          display: flex;
          flex-direction: column;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .benefit-row {
          display: flex;
          gap: 16px;
        }

        .price-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .price-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent);
          pointer-events: none;
        }

        .price-header {
          margin-bottom: 20px;
        }

        .price-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .price-content {
          position: relative;
          z-index: 1;
        }

        .price-original {
          font-size: 0.95rem;
          color: #94a3b8;
          text-decoration: line-through;
          margin-bottom: 8px;
        }

        .price-display {
          background: rgba(30, 41, 59, 0.6);
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .price-main {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .price-currency {
          font-size: 1rem;
          color: #94a3b8;
        }

        .price-amount {
          font-size: 3.5rem;
          font-weight: 900;
          color: #10b981;
          line-height: 1;
        }

        .price-cents {
          font-size: 1.5rem;
          color: #94a3b8;
        }

        .price-interval {
          font-size: 0.85rem;
          color: #cbd5e1;
          font-weight: 600;
        }

        .features-inline {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .inline-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: #e2e8f0;
        }

        .btn-cta-primary {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
        }

        .testimonial-mini {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(51, 65, 85, 0.3);
        }

        .testimonial-mini p:first-child {
          font-size: 0.9rem;
          color: #cbd5e1;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 0.85rem;
        }

        .testimonial-author p {
          margin: 0;
        }

        .testimonial-author p:first-child {
          font-size: 0.9rem;
          color: #e2e8f0;
        }

        @media (max-width: 1024px) {
          .offer-wrapper {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .price-card {
            padding: 30px;
          }

          .price-amount {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .offer-wrapper {
            gap: 20px;
          }

          .benefits-list {
            gap: 15px;
          }

          .benefit-row {
            gap: 12px;
          }

          .price-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}