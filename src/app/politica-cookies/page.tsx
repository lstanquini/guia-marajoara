import { PolicyLayout } from '@/components/PolicyLayout'

export const metadata = {
  title: 'Política de Cookies | Guia Marajoara',
  description: 'Como utilizamos cookies no Guia Marajoara'
}

export default function CookiesPage() {
  return (
    <PolicyLayout 
      title="Política de Cookies" 
      lastUpdate="15 de setembro de 2025"
      currentPage="cookies"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. O que são Cookies?</h2>
        <p className="mb-4">
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site. Eles nos ajudam a melhorar sua experiência de navegação e entender como o site é utilizado.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Tipos de Cookies que Utilizamos</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Cookies Essenciais (Obrigatórios)</h3>
        <p className="mb-2">Necessários para o funcionamento básico do site:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>session_id:</strong> Mantém sua sessão ativa</li>
          <li><strong>csrf_token:</strong> Proteção contra ataques</li>
          <li><strong>user_preferences:</strong> Suas preferências de navegação</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Cookies de Performance (Opcionais)</h3>
        <p className="mb-2">Coletam informações sobre como você usa o site:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>_ga:</strong> Google Analytics - análise de tráfego</li>
          <li><strong>_gid:</strong> Google Analytics - identificação de usuários</li>
          <li><strong>_gtm:</strong> Google Tag Manager - gerenciamento de tags</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Cookies de Funcionalidade (Opcionais)</h3>
        <p className="mb-2">Lembram suas escolhas e preferências:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>location:</strong> Sua localização aproximada</li>
          <li><strong>last_search:</strong> Últimas buscas realizadas</li>
          <li><strong>favorites:</strong> Empresas favoritas</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.4 Cookies de Marketing (Opcionais)</h3>
        <p className="mb-4">
          Atualmente <strong>NÃO utilizamos</strong> cookies de marketing como Facebook Pixel ou Google Ads.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Bases Legais (LGPD)</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Consentimento</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Solicitamos seu consentimento no primeiro acesso</li>
          <li>Você pode retirar o consentimento a qualquer momento</li>
          <li>Banner de cookies visível e claro</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Legítimo Interesse</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Cookies essenciais para funcionamento</li>
          <li>Segurança e prevenção de fraudes</li>
          <li>Melhorias na experiência do usuário</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Dados Coletados pelos Cookies</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Informações Técnicas</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Tipo de navegador</li>
          <li>Sistema operacional</li>
          <li>Endereço IP (anonimizado)</li>
          <li>Páginas visitadas</li>
          <li>Tempo de permanência</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Informações de Uso</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Buscas realizadas</li>
          <li>Cupons visualizados</li>
          <li>Empresas acessadas</li>
          <li>Horários de acesso</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Compartilhamento de Dados</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">❌ Não Compartilhamos:</h4>
            <ul className="text-sm space-y-1 text-red-800">
              <li>• Dados pessoais identificáveis</li>
              <li>• Informações sensíveis</li>
              <li>• Histórico completo de navegação</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">✓ Podemos Compartilhar:</h4>
            <ul className="text-sm space-y-1 text-green-800">
              <li>• Dados agregados e anônimos</li>
              <li>• Estatísticas de uso</li>
              <li>• Com parceiros de análise (Google Analytics)</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tempo de Armazenamento</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tipo de Cookie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Duração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">Sessão</td>
                <td className="px-4 py-3 text-sm">Até fechar o navegador</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Persistentes</td>
                <td className="px-4 py-3 text-sm">30 dias a 1 ano</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Analytics</td>
                <td className="px-4 py-3 text-sm">26 meses</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Marketing</td>
                <td className="px-4 py-3 text-sm">Não utilizamos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Como Gerenciar Cookies</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 No Seu Navegador</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Chrome:</p>
            <p className="text-sm text-gray-600">Configurações → Privacidade → Cookies</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Firefox:</p>
            <p className="text-sm text-gray-600">Opções → Privacidade → Cookies</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Safari:</p>
            <p className="text-sm text-gray-600">Preferências → Privacidade → Cookies</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Edge:</p>
            <p className="text-sm text-gray-600">Configurações → Privacidade → Cookies</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Desativar Cookies</h3>
        <p className="mb-2">Você pode desativar cookies, mas isso pode afetar:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Funcionalidades do site</li>
          <li>Experiência personalizada</li>
          <li>Performance e velocidade</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies de Terceiros</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.1 Google Analytics</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Finalidade:</strong> Análise de tráfego</li>
          <li><strong>Dados:</strong> Comportamento anônimo</li>
          <li><strong>Opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#C2227A] hover:underline">Google Analytics Opt-out</a></li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.2 CloudFlare</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Finalidade:</strong> Segurança e performance</li>
          <li><strong>Dados:</strong> Proteção contra bots</li>
          <li><strong>Essencial</strong> para funcionamento</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Segurança dos Cookies</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.1 Medidas de Proteção</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Cookies HTTPOnly (não acessíveis via JavaScript)</li>
          <li>Cookies Secure (apenas HTTPS)</li>
          <li>SameSite (proteção CSRF)</li>
          <li>Criptografia de dados sensíveis</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.2 Não Armazenamos</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Senhas em cookies</li>
          <li>Dados de pagamento</li>
          <li>Informações sensíveis</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Direitos do Usuário (LGPD)</h2>
        <p className="mb-4">
          Você tem direito a acessar, corrigir, excluir e revogar consentimento sobre seus dados a qualquer momento.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">Como Exercer seus Direitos:</p>
          <p className="text-sm">Email: comercialfmad@gmail.com</p>
          <p className="text-sm">Prazo de resposta: 15 dias</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contato e Dúvidas</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="font-semibold mb-4">Encarregado de Dados (DPO):</p>
          <p className="mb-4">FMAD Local Marketing</p>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Email:</strong> comercialfmad@gmail.com</li>
            <li><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</li>
          </ul>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
        © 2025 Guia Marajoara - Política de Cookies em conformidade com a LGPD
      </footer>
    </PolicyLayout>
  )
}