import { X as Twitter } from 'lucide-react';

export default function Radar() {
  return (
    <section style={{ backgroundColor: '#020617', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Badge Simples */}
        <p style={{ 
          color: '#10b981', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          marginBottom: '16px' 
        }}>
          Acompanhe as Novidades
        </p>

        <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>
          Fique por dentro no <span style={{ color: '#10b981' }}>X</span>
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
          Siga nosso perfil oficial para atualizações diárias sobre editais, 
          técnicas de estudo e tecnologia aplicada a concursos.
        </p>

        {/* Card do X (Twitter) - Estilo Botão de Ação Direto */}
        <a
          href="https://x.com/theonlybold"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            backgroundColor: '#ffffff', // Fundo branco para máximo contraste
            color: '#000000',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '800',
            transition: 'transform 0.2s ease',
            textDecoration: 'none'
          }}
        >
          <Twitter size={24} fill="#000" />
          Seguir @theonlybold
        </a>

        <p style={{ color: '#475569', fontSize: '12px', marginTop: '20px' }}>
          Junte-se a outros candidatos de elite.
        </p>
      </div>
    </section>
  );
}