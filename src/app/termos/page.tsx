import { PolicyLayout } from '@/components/PolicyLayout'

export const metadata = {
  title: 'Termos de Uso | Guia Marajoara',
  description: 'Termos e condições de uso do Guia Marajoara'
}

export default function TermosPage() {
  return (
    <PolicyLayout 
      title="Termos de Uso" 
      lastUpdate="15 de setembro de 2025"
      currentPage="termos"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar e usar o Guia Marajoara ("nós", "nosso" ou "Site"), você aceita e concorda em cumprir estes Termos de Uso. Se você não concordar com algum destes termos, não utilize nosso site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso do Site</h2>
        <p className="mb-4">
          O Guia Marajoara é um diretório digital que conecta consumidores a empresas locais do Jardim Marajoara.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Elegibilidade</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Você deve ter pelo menos 18 anos para usar nossos serviços</li>
          <li>As informações fornecidas devem ser verdadeiras e atualizadas</li>
          <li>É proibido usar o site para atividades ilegais ou não autorizadas</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Gratuidade</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>O acesso e uso do site é gratuito para consumidores finais</li>
          <li>Empresas pagam taxas conforme plano escolhido</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cupons e Ofertas</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Responsabilidade</h3>
        <p className="mb-4">
          Os cupons disponibilizados são de responsabilidade exclusiva das empresas parceiras.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Isenção</h3>
        <p className="mb-2">O Guia Marajoara NÃO se responsabiliza por:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Validade ou aplicação dos descontos</li>
          <li>Qualidade dos produtos ou serviços</li>
          <li>Alterações nas condições das ofertas</li>
          <li>Disponibilidade de produtos/serviços</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cadastro de Empresas</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Requisitos</h3>
        <p className="mb-2">Empresas que desejam se cadastrar devem:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Possuir CNPJ válido e ativo</li>
          <li>Fornecer informações verdadeiras e completas</li>
          <li>Manter seus dados atualizados</li>
          <li>Honrar os cupons e ofertas publicados</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Pagamento</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Plano Basic: R$ 49,90/mês</li>
          <li>Plano Premium: R$ 99,90/mês</li>
          <li>Pagamento via PIX</li>
          <li>Renovação automática mensal</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Propriedade Intelectual</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Direitos Autorais</h3>
        <p className="mb-2">Todo o conteúdo do site é propriedade do Guia Marajoara ou de seus parceiros:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Textos, imagens, logos e design</li>
          <li>Código-fonte e funcionalidades</li>
          <li>Marca "Guia Marajoara"</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Uso Permitido</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Visualização e compartilhamento de links</li>
          <li>Download de cupons para uso pessoal</li>
          <li>É proibida a reprodução sem autorização</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Privacidade e Dados Pessoais</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 LGPD Compliance</h3>
        <p className="mb-4">
          Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Dados Coletados</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Nome e telefone (para cupons)</li>
          <li>Dados de empresas (cadastro)</li>
          <li>Cookies de navegação</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Política Completa</h3>
        <p className="mb-4">
          Consulte nossa <a href="/politica-privacidade" className="text-[#C2227A] hover:underline">Política de Privacidade</a> para detalhes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Limitação de Responsabilidade</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Isenções</h3>
        <p className="mb-2">O Guia Marajoara NÃO se responsabiliza por:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Transações realizadas entre usuários e empresas</li>
          <li>Qualidade, segurança ou legalidade dos produtos/serviços</li>
          <li>Veracidade das informações fornecidas pelas empresas</li>
          <li>Danos diretos ou indiretos decorrentes do uso do site</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Relação com Empresas</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Não somos intermediários nas transações</li>
          <li>Não garantimos resultados de vendas</li>
          <li>Não nos responsabilizamos por conflitos</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cancelamento e Suspensão</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.1 Por parte do Usuário</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Consumidores podem deixar de usar o site a qualquer momento</li>
          <li>Empresas devem solicitar cancelamento com 30 dias de antecedência</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.2 Por nossa parte</h3>
        <p className="mb-2">Podemos suspender ou cancelar acesso em caso de:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Violação destes termos</li>
          <li>Atividades fraudulentas</li>
          <li>Informações falsas</li>
          <li>Não pagamento (empresas)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Modificações dos Termos</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.1 Atualizações</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Podemos modificar estes termos a qualquer momento</li>
          <li>Alterações entram em vigor após publicação</li>
          <li>Uso continuado implica aceitação das mudanças</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.2 Notificação</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Mudanças significativas serão notificadas</li>
          <li>Email para empresas cadastradas</li>
          <li>Aviso no site por 30 dias</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Lei Aplicável e Foro</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.1 Legislação</h3>
        <p className="mb-4">
          Estes termos são regidos pelas leis brasileiras.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.2 Foro</h3>
        <p className="mb-4">
          Fica eleito o foro da Comarca de São Paulo/SP para dirimir questões.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contato</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="font-semibold mb-2">FMAD Local Marketing</p>
          <ul className="space-y-2 text-gray-700">
            <li>Email: comercialfmad@gmail.com</li>
            <li>Instagram: @jardimmarajoarasp</li>
          </ul>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
        © 2025 Guia Marajoara - Todos os direitos reservados
      </footer>
    </PolicyLayout>
  )
}