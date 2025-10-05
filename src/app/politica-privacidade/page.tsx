import { PolicyLayout } from '@/components/PolicyLayout'

export const metadata = {
  title: 'Política de Privacidade | Guia Marajoara',
  description: 'Política de Privacidade e proteção de dados do Guia Marajoara em conformidade com a LGPD'
}

export default function PrivacidadePage() {
  return (
    <PolicyLayout 
      title="Política de Privacidade" 
      lastUpdate="15 de setembro de 2025"
      currentPage="privacidade"
    >
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <p className="text-sm text-blue-900">
          <strong>Versão:</strong> 1.0.0 | Esta Política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Informações Gerais</h2>
        <p className="mb-4">
          A <strong>FMAD LOCAL MARKETING</strong> ("nós", "nosso" ou "Guia Marajoara"), inscrita no CNPJ sob nº XX.XXX.XXX/0001-XX, com sede em São Paulo/SP, opera o site www.guiamarajoara.com.br e é responsável pelo tratamento de dados pessoais conforme descrito nesta Política.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Dados que Coletamos</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Para Consumidores (Usuários do Site)</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Nome completo</strong> - Para personalização e identificação</li>
          <li><strong>Telefone/WhatsApp</strong> - Para envio de cupons</li>
          <li><strong>E-mail</strong> (opcional) - Para newsletter, se consentido</li>
          <li><strong>Dados de navegação</strong> - IP (anonimizado), páginas visitadas</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Para Empresas Parceiras</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Dados da empresa:</strong> CNPJ, razão social, nome fantasia</li>
          <li><strong>Dados do responsável:</strong> Nome, CPF (criptografado), telefone, e-mail</li>
          <li><strong>Dados comerciais:</strong> Endereço, horários, categorias</li>
          <li><strong>Dados de acesso:</strong> E-mail e senha (hash)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Finalidade do Tratamento</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Dados</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Finalidade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Base Legal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">Nome e WhatsApp</td>
                <td className="px-4 py-3 text-sm">Envio de cupons</td>
                <td className="px-4 py-3 text-sm">Consentimento</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">E-mail</td>
                <td className="px-4 py-3 text-sm">Newsletter</td>
                <td className="px-4 py-3 text-sm">Consentimento</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">CNPJ/CPF</td>
                <td className="px-4 py-3 text-sm">Cadastro comercial</td>
                <td className="px-4 py-3 text-sm">Execução de contrato</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Dados de navegação</td>
                <td className="px-4 py-3 text-sm">Melhorias no site</td>
                <td className="px-4 py-3 text-sm">Interesse legítimo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Compartilhamento de Dados</h2>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="font-semibold text-yellow-900">
            Seus dados pessoais NÃO SÃO VENDIDOS para terceiros.
          </p>
        </div>

        <p className="mb-2">Compartilhamos dados apenas com:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Supabase:</strong> Armazenamento seguro (servidores no Brasil)</li>
          <li><strong>WhatsApp Business:</strong> Envio de cupons (apenas número)</li>
          <li><strong>Autoridades:</strong> Quando exigido por lei</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Seus Direitos (LGPD)</h2>
        
        <p className="mb-4">Você tem direito a:</p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Acessar</strong> seus dados pessoais</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Corrigir</strong> dados incorretos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Excluir</strong> seus dados (direito ao esquecimento)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Portabilidade</strong> dos dados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Revogar</strong> consentimento a qualquer momento</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Opor-se</strong> ao tratamento</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Informação</strong> sobre compartilhamento</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Como exercer seus direitos:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>E-mail: comercialfmad@gmail.com</li>
          <li>Prazo de resposta: 15 dias úteis</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Segurança dos Dados</h2>
        
        <p className="mb-4">Medidas de segurança implementadas:</p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>Criptografia AES-256 para dados sensíveis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>HTTPS em todas as páginas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>Senhas com hash bcrypt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>Firewall e monitoramento 24/7</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>Backup diário automático</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🔐</span>
            <span>Acesso restrito por RLS (Row Level Security)</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Retenção e Exclusão</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Prazos de Retenção</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Cupons resgatados:</strong> 2 anos (depois anonimizados)</li>
          <li><strong>Dados de empresas:</strong> Durante vigência do contrato + 5 anos</li>
          <li><strong>Newsletter:</strong> Até revogação do consentimento</li>
          <li><strong>Logs de acesso:</strong> 6 meses</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Exclusão Automática</h3>
        <p className="mb-4">
          Dados são automaticamente anonimizados ou excluídos após o prazo legal.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies</h2>
        <p className="mb-4">
          Utilizamos cookies essenciais para manter sua sessão ativa, lembrar suas preferências e analisar uso do site (Google Analytics - anonimizado).
        </p>
        <p className="mb-4">
          Você pode desabilitar cookies no navegador, mas algumas funcionalidades podem ser afetadas. Para mais informações, consulte nossa <a href="/politica-cookies" className="text-[#C2227A] hover:underline">Política de Cookies</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Menores de Idade</h2>
        <p className="mb-4">
          Não coletamos intencionalmente dados de menores de 18 anos. Caso identifiquemos, excluiremos imediatamente.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Transferência Internacional</h2>
        <p className="mb-4">
          Seus dados são armazenados no Brasil. Caso haja transferência internacional, garantimos o mesmo nível de proteção.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Alterações na Política</h2>
        <p className="mb-4">
          Reservamos o direito de atualizar esta política. Alterações significativas serão notificadas por e-mail.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contato</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="font-semibold mb-4">Para dúvidas sobre privacidade:</p>
          <ul className="space-y-2 text-gray-700">
            <li><strong>E-mail:</strong> comercialfmad@gmail.com</li>
            <li><strong>Endereço:</strong> Jardim Marajoara, São Paulo/SP</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Autoridade Nacional</h2>
        <p className="mb-4">
          Você pode registrar reclamações na ANPD (Autoridade Nacional de Proteção de Dados):
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#C2227A] hover:underline">www.gov.br/anpd</a></li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-900">
            <strong>Ao usar nosso site, você concorda com esta Política de Privacidade.</strong>
          </p>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          © 2025 Guia Marajoara - Todos os direitos reservados
        </p>
      </footer>
    </PolicyLayout>
  )
}