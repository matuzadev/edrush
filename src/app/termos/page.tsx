import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Termos de Serviço | EdRush',
  description: 'Leia as condições de uso da plataforma EdRush.',
};

const updatedAt = '3 de novembro de 2026';

export default function TermsPage() {
  return (
    <LegalPageLayout title="Termos de Serviço" updatedAt={updatedAt}>
      <section>
        <h2>1. Aceitação e serviço</h2>
        <p>
          Ao acessar ou usar o EdRush, você concorda com estes Termos e com a{' '}
          <a href="/privacidade">Política de Privacidade</a>. Se não concordar, não use os
          recursos que dependem de uma conta. O EdRush oferece ferramentas de estudo e
          interação voltadas à preparação para concursos públicos.
        </p>
      </section>

      <section>
        <h2>2. Conta e responsabilidades</h2>
        <ul>
          <li>Forneça informações corretas e mantenha seus dados de acesso em segurança.</li>
          <li>Você é responsável pelas atividades realizadas usando sua conta.</li>
          <li>Não compartilhe sua senha nem tente acessar contas de outras pessoas.</li>
          <li>
            Se suspeitar de uso não autorizado da conta, interrompa o uso e reporte o problema
            pelo canal de suporte disponível no aplicativo.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Uso permitido</h2>
        <p>
          Use a plataforma de forma lícita e respeitosa. Não tente comprometer sua segurança,
          interromper seu funcionamento, contornar controles de acesso, automatizar acessos de
          modo abusivo, enviar código malicioso, praticar fraude ou violar direitos de terceiros.
        </p>
      </section>

      <section>
        <h2>4. Conteúdo publicado por usuários</h2>
        <p>
          Você mantém os direitos sobre o conteúdo que cria, na medida permitida pela lei. Ao
          publicar ou enviar conteúdo, autoriza o EdRush a armazená-lo, exibi-lo e processá-lo
          para operar os recursos que você utiliza, como perfil, comunidade e suporte. Você
          declara ter direito de enviar esse material e não deve publicar conteúdo ilegal,
          enganoso, abusivo, discriminatório, invasivo ou que viole direitos autorais,
          privacidade ou outros direitos.
        </p>
        <p>
          O conteúdo de comunidade pode ficar visível a outros usuários conforme as
          funcionalidades e configurações do produto. Podemos remover conteúdo ou restringir
          contas quando necessário para proteger usuários, cumprir a lei ou aplicar estes
          Termos, observadas as circunstâncias e a legislação aplicável.
        </p>
      </section>

      <section>
        <h2>5. Materiais de estudo e propriedade intelectual</h2>
        <p>
          A plataforma, sua marca, interface e materiais próprios são protegidos por direitos
          aplicáveis. Os materiais devem ser usados para fins pessoais de estudo, sem cópia em
          massa, redistribuição, exploração comercial ou remoção de avisos de autoria sem
          autorização. Conteúdo de terceiros permanece sujeito aos direitos e às condições de
          seus respectivos titulares.
        </p>
      </section>

      <section>
        <h2>6. Conteúdo educacional</h2>
        <p>
          O EdRush é uma ferramenta de apoio aos estudos, não representa órgãos públicos,
          bancas examinadoras ou organizadores de concursos e não substitui editais nem fontes
          oficiais. Informações, questões e materiais podem conter erros ou ficar desatualizados.
          Confira requisitos, datas, regras e alterações diretamente nos canais oficiais. O uso
          da plataforma não garante aprovação ou qualquer resultado específico.
        </p>
      </section>

      <section>
        <h2>7. Gratuidade e recursos virtuais</h2>
        <p>
          Os recursos de estudo atualmente oferecidos são gratuitos, conforme informado no
          site. Recursos virtuais, como moedas e itens cosméticos, servem apenas para
          funcionalidades da plataforma, não são moeda real e não representam dinheiro ou
          investimento. Se houver mudança relevante no modelo de acesso, ela será informada
          antes de entrar em vigor e observará a legislação aplicável.
        </p>
      </section>

      <section>
        <h2>8. Disponibilidade e limitações</h2>
        <p>
          Buscamos manter o serviço disponível, mas não garantimos funcionamento ininterrupto,
          livre de falhas ou compatível com todos os dispositivos. Podemos atualizar,
          suspender ou descontinuar recursos por motivos técnicos, de segurança ou operação.
          Nada nestes Termos exclui direitos ou responsabilidades que não possam ser afastados
          pela legislação aplicável.
        </p>
      </section>

      <section>
        <h2>9. Suspensão e encerramento</h2>
        <p>
          Podemos limitar ou suspender o acesso em caso de violação destes Termos, risco à
          segurança, fraude ou obrigação legal, considerando a gravidade e as circunstâncias.
          Você pode deixar de usar o serviço a qualquer momento. Para solicitar ajuda sobre
          conta ou dados pessoais, use o botão <strong>Reportar problema</strong> disponível
          no aplicativo e descreva a solicitação.
        </p>
      </section>

      <section>
        <h2>10. Alterações e legislação aplicável</h2>
        <p>
          Estes Termos podem ser atualizados para refletir mudanças no serviço ou na legislação.
          A versão vigente estará publicada nesta página com a data de atualização. Aplicam-se
          as leis da República Federativa do Brasil, sem prejuízo das normas obrigatórias de
          proteção ao consumidor e de competência previstas em lei.
        </p>
      </section>

      <section>
        <h2>11. Contato</h2>
        <p>
          Para dúvidas ou solicitações, use o botão <strong>Reportar problema</strong> no
          aplicativo e informe um e-mail para retorno. Solicitações relacionadas a dados
          pessoais devem ser identificadas como “Privacidade”.
        </p>
      </section>
    </LegalPageLayout>
  );
}
