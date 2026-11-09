import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Política de Privacidade | EdRush',
  description: 'Saiba quais dados o EdRush trata, para quais finalidades e como exercer seus direitos.',
};

const updatedAt = '3 de novembro de 2026';

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Política de Privacidade" updatedAt={updatedAt}>
      <section>
        <h2>1. Sobre esta política</h2>
        <p>
          Esta política explica como o EdRush trata dados pessoais quando você visita o site,
          cria uma conta ou usa recursos de estudo e comunidade. O tratamento deve observar a
          legislação aplicável, incluindo a Lei Geral de Proteção de Dados Pessoais (Lei nº
          13.709/2018 — LGPD).
        </p>
      </section>

      <section>
        <h2>2. Dados tratados</h2>
        <ul>
          <li>
            <strong>Cadastro e acesso:</strong> nome, e-mail, nome de usuário e senha armazenada
            como hash. Se você escolher o login Google, recebemos os dados básicos de perfil
            autorizados por você, como nome, e-mail e, quando fornecida, foto.
          </li>
          <li>
            <strong>Perfil:</strong> informações que você decide fornecer, como data de
            nascimento, localização, biografia, avatar, concurso e áreas de interesse.
          </li>
          <li>
            <strong>Uso da plataforma:</strong> respostas, sessões de estudo, progresso,
            preferências, itens virtuais, interações e conteúdo que você publica ou envia.
          </li>
          <li>
            <strong>Presença:</strong> quando você está autenticado e usa o site com a página
            visível, registramos seu identificador de conta e o horário da atividade recente
            para calcular uma contagem agregada de estudantes online. Essa contagem não exibe
            sua identidade.
          </li>
          <li>
            <strong>Suporte:</strong> se você enviar um relatório de problema, podemos receber o
            texto informado, e-mail opcional, página, dados técnicos do navegador e captura de
            tela opcional.
          </li>
          <li>
            <strong>Dados técnicos:</strong> informações necessárias para manter o serviço,
            protegê-lo contra abuso e diagnosticar falhas, que podem ser registradas pelo
            navegador, hospedagem ou infraestrutura utilizada.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidades e bases do tratamento</h2>
        <p>Usamos os dados na medida necessária para:</p>
        <ul>
          <li>criar e proteger sua conta, autenticar seu acesso e prestar os recursos solicitados;</li>
          <li>salvar respostas, progresso, preferências e interações da plataforma;</li>
          <li>exibir funcionalidades sociais e uma contagem agregada de presença recente;</li>
          <li>responder a solicitações de suporte, prevenir fraude e manter a segurança;</li>
          <li>cumprir obrigações legais e exercer direitos em processos administrativos ou judiciais.</li>
        </ul>
        <p>
          Conforme o caso, o tratamento pode se apoiar na execução de contrato ou de
          procedimentos solicitados por você, no cumprimento de obrigação legal, no exercício
          regular de direitos, em legítimo interesse observado o equilíbrio com seus direitos,
          ou no consentimento quando ele for a base adequada. Quando o tratamento depender de
          consentimento, você poderá revogá-lo, sem afetar o tratamento anterior legítimo.
        </p>
      </section>

      <section>
        <h2>4. Cookies e armazenamento no dispositivo</h2>
        <p>
          O serviço usa mecanismos técnicos necessários para autenticação e funcionamento da
          sessão. Também pode guardar preferências de interface e informações de indicação no
          armazenamento local do navegador. Você pode limpar esses dados nas configurações do
          navegador; isso pode encerrar sua sessão ou redefinir preferências.
        </p>
      </section>

      <section>
        <h2>5. Compartilhamento e fornecedores</h2>
        <p>
          Não vendemos seus dados pessoais. O acesso pode ser realizado por fornecedores que
          viabilizam o serviço, de acordo com suas funções: hospedagem e entrega do site
          (Vercel), banco de dados (Turso/libSQL), autenticação Google se escolhida por você e
          armazenamento de arquivos enviados (Vercel Blob). Dados também podem ser fornecidos
          quando necessário para cumprir a lei, atender uma ordem válida ou proteger direitos e
          a segurança da plataforma e de seus usuários.
        </p>
        <p>
          Esses fornecedores podem processar dados em infraestrutura localizada fora do Brasil.
          Quando isso ocorrer, o tratamento deve observar as regras aplicáveis à transferência
          internacional de dados.
        </p>
      </section>

      <section>
        <h2>6. Retenção e segurança</h2>
        <p>
          Mantemos os dados pelo tempo necessário para operar sua conta, fornecer os recursos,
          cumprir obrigações legais e resolver disputas. Os registros de presença são usados
          para atividade recente e deixam de contar como online após alguns minutos; isso não
          significa que o registro seja imediatamente apagado do banco. Prazos de retenção
          podem variar conforme a categoria de dado e a necessidade legal ou operacional.
        </p>
        <p>
          Senhas de cadastro não são armazenadas em texto puro: o sistema armazena um hash.
          Adotamos controles técnicos e organizacionais compatíveis com a operação, mas nenhum
          serviço conectado à internet pode garantir segurança absoluta.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos e solicitações</h2>
        <p>
          Nos termos da LGPD, você pode solicitar confirmação e acesso aos dados, correção,
          informação sobre compartilhamento, anonimização, bloqueio ou eliminação quando
          cabíveis, portabilidade quando aplicável e revisão de decisões automatizadas, além de
          revogar consentimento quando essa for a base usada.
        </p>
        <p>
          Para fazer uma solicitação, use o botão <strong>Reportar problema</strong> disponível
          no aplicativo, coloque “Privacidade” no título e informe um e-mail para retorno.
          Podemos solicitar informações razoáveis para confirmar sua identidade antes de
          atender o pedido.
        </p>
      </section>

      <section>
        <h2>8. Crianças e adolescentes</h2>
        <p>
          O serviço é voltado à preparação para concursos e não é direcionado a crianças.
          Responsáveis devem acompanhar o uso por crianças e adolescentes e entrar em contato
          conosco se acreditarem que dados foram fornecidos indevidamente.
        </p>
      </section>

      <section>
        <h2>9. Alterações e contato</h2>
        <p>
          Esta política pode ser atualizada para refletir mudanças no serviço ou na legislação.
          A versão vigente estará publicada nesta página com a data de atualização. Para
          solicitações de privacidade, consulte o canal descrito na seção 7.
        </p>
      </section>
    </LegalPageLayout>
  );
}
