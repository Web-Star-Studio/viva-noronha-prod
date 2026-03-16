"use node";

import type { EmailData } from "./types";
import { voucherEmailTemplate } from "./templates/voucher";
import {
  newPackageRequestAdminEmail,
  proposalAcceptedAdminEmail,
  proposalRejectedAdminEmail,
  proposalRevisionRequestedAdminEmail,
  proposalSentTravelerEmail,
  packageRequestReceivedTravelerEmail,
  flightBookingStartedTravelerEmail,
  flightsConfirmedTravelerEmail,
  documentsReadyTravelerEmail,
  bookingConfirmationEmail,
  bookingCancelledEmail,
  welcomeNewUserEmail,
  partnerNewBookingEmail,
} from "./templates/packageRequests";

// Função auxiliar para formatar moeda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função auxiliar para formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Template base para todos os emails
const getBaseTemplate = (content: string): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Viva Noronha</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 2rem 1.5rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 2rem 1.5rem;
        }
        
        .highlight-box {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 1rem;
            margin: 1rem 0;
        }
        
        .confirmation-code {
            background-color: #1e40af;
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
            margin: 1rem 0;
        }
        
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 1rem 0;
        }
        
        .button:hover {
            background-color: #2563eb;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .info-item {
            background-color: #f8fafc;
            padding: 0.75rem;
            border-radius: 4px;
        }
        
        .info-label {
            font-weight: 600;
            color: #4b5563;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
        }
        
        .info-value {
            color: #1f2937;
            font-size: 1rem;
        }
        
        .footer {
            background-color: #1f2937;
            color: #d1d5db;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
        }
        
        .footer a {
            color: #60a5fa;
            text-decoration: none;
        }
        
        .urgent {
            background-color: #fef2f2;
            border: 1px solid #fca5a5;
            color: #b91c1c;
        }
        
        .success {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .header {
                padding: 1.5rem 1rem;
            }
            
            .content {
                padding: 1.5rem 1rem;
            }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
  `;
};

// Template para confirmação de reserva
export const getBookingConfirmationTemplate = (data: any): string => {
  // Gerar lista HTML com todos os detalhes extras da reserva (campos dinâmicos)
  const extraDetailsHtml = data.bookingDetails
    ? Object.entries(data.bookingDetails)
        .map(([key, value]) => {
          // Transformar chave em formato legível (ex: "pickupLocation" => "Pickup Location")
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase());
          const displayValue =
            typeof value === "object"
              ? JSON.stringify(value)
              : String(value);
          return `<li><strong>${label}:</strong> ${displayValue}</li>`;
        })
        .join("")
    : "";
  const content = `
    <div class="container">
        <div class="header">
            <h1>📋 Solicitação de Reserva Recebida!</h1>
            <p>Sua solicitação foi recebida e está aguardando aprovação</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.customerName}</strong>,</p>
            <p>Recebemos sua solicitação de reserva para <strong>${data.assetName}</strong>!</p>
            
            <div class="highlight-box" style="background-color: #fef3c7; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                    <strong>⏳ Aguardando Aprovação:</strong> Sua solicitação será analisada pelo parceiro. 
                    Você receberá uma notificação assim que for confirmada.
                </p>
            </div>
            
            <div class="confirmation-code">
                Código de Acompanhamento: ${data.confirmationCode}
            </div>
            
            <div class="highlight-box success">
                <h3>Detalhes da Solicitação</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Tipo</div>
                        <div class="info-value">${data.bookingType === 'activity' ? 'Atividade' : 
                                                  data.bookingType === 'event' ? 'Evento' :
                                                  data.bookingType === 'restaurant' ? 'Restaurante' :
                                                  data.bookingType === 'vehicle' ? 'Veículo' : 'Hospedagem'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data</div>
                        <div class="info-value">${formatDate(data.bookingDate)}</div>
                    </div>
                    ${data.totalPrice ? `
                    <div class="info-item">
                        <div class="info-label">Valor Total</div>
                        <div class="info-value">${formatCurrency(data.totalPrice)}</div>
                    </div>
                    ` : ''}
                    ${data.partnerName ? `
                    <div class="info-item">
                        <div class="info-label">Responsável</div>
                        <div class="info-value">${data.partnerName}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${data.bookingDetails ? `
            <div class="highlight-box">
                <h3>Informações Adicionais da Solicitação</h3>
                <ul style="margin: 0 0 0 1.5rem;">
                    ${extraDetailsHtml}
                </ul>
            </div>
            ` : ''}
            
            <p><strong>Importante:</strong> Guarde este código de acompanhamento. Você receberá um email de confirmação quando sua reserva for aprovada pelo parceiro.</p>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/reservas" class="button">
                    Acompanhar Minhas Solicitações
                </a>
            </div>
            
            <p>Se você tiver alguma dúvida, entre em contato conosco através do nosso suporte.</p>
            
            <p>Obrigado por escolher o Viva Noronha! ✈️🏝️</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para cancelamento de reserva
export const getBookingCancelledTemplate = (data: any): string => {
  const content = `
    <div class="container">
        <div class="header">
            <h1>❌ Reserva Cancelada</h1>
            <p>Informações sobre o cancelamento</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.customerName}</strong>,</p>
            <p>Sua reserva para <strong>${data.assetName}</strong> foi cancelada.</p>
            
            <div class="highlight-box urgent">
                <h3>Detalhes do Cancelamento</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Código da Reserva</div>
                        <div class="info-value">${data.confirmationCode}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tipo</div>
                        <div class="info-value">${data.bookingType === 'activity' ? 'Atividade' : 
                                                  data.bookingType === 'event' ? 'Evento' :
                                                  data.bookingType === 'restaurant' ? 'Restaurante' :
                                                  data.bookingType === 'vehicle' ? 'Veículo' : 'Hospedagem'}</div>
                    </div>
                    ${data.reason ? `
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <div class="info-label">Motivo</div>
                        <div class="info-value">${data.reason}</div>
                    </div>
                    ` : ''}
                    ${data.refundAmount ? `
                    <div class="info-item">
                        <div class="info-label">Valor do Reembolso</div>
                        <div class="info-value">${formatCurrency(data.refundAmount)}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${data.refundAmount ? `
            <p><strong>Reembolso:</strong> O valor de ${formatCurrency(data.refundAmount)} será estornado em sua forma de pagamento original em até 5 dias úteis.</p>
            ` : ''}
            
            <p>Lamentamos qualquer inconveniente causado. Nossa equipe está sempre disponível para ajudá-lo a encontrar outras opções incríveis em Fernando de Noronha.</p>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}" class="button">
                    Explorar Outras Opções
                </a>
            </div>
            
            <p>Se você tiver alguma dúvida sobre este cancelamento, entre em contato conosco.</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para solicitação de pacote recebida (GENÉRICO - SEM DADOS ESPECÍFICOS)
// Este template é apenas para o viajante. O admin recebe um email separado.
export const getPackageRequestReceivedTemplate = (data: any): string => {
  const { packageRequestReceivedTravelerEmail } = require("./templates/packageRequests");
  return packageRequestReceivedTravelerEmail();
};

// Template para nova reserva (para parceiros)
export const getPartnerNewBookingTemplate = (data: any): string => {
  const extraDetailsHtml = data.bookingDetails
    ? Object.entries(data.bookingDetails)
        .map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase());
          const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return `<li><strong>${label}:</strong> ${displayValue}</li>`;
        })
        .join('')
    : '';
  const content = `
    <div class="container">
        <div class="header">
            <h1>🎯 Nova Reserva Recebida!</h1>
            <p>Você tem uma nova reserva para confirmar</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.partnerName}</strong>,</p>
            <p>Você recebeu uma nova reserva para <strong>${data.assetName}</strong>!</p>
            
            <div class="highlight-box success">
                <h3>Detalhes da Reserva</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Cliente</div>
                        <div class="info-value">${data.customerName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Código de Confirmação</div>
                        <div class="info-value">${data.confirmationCode}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Data</div>
                        <div class="info-value">${formatDate(data.bookingDate)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Tipo</div>
                        <div class="info-value">${data.bookingType === 'activity' ? 'Atividade' : 
                                                  data.bookingType === 'event' ? 'Evento' :
                                                  data.bookingType === 'restaurant' ? 'Restaurante' :
                                                  data.bookingType === 'vehicle' ? 'Veículo' : 'Hospedagem'}</div>
                    </div>
                    ${data.totalPrice ? `
                    <div class="info-item">
                        <div class="info-label">Valor</div>
                        <div class="info-value">${formatCurrency(data.totalPrice)}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="highlight-box">
                <h3>Contato do Cliente</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${data.customerContact.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Telefone</div>
                        <div class="info-value">${data.customerContact.phone}</div>
                    </div>
                </div>
            </div>
            
            ${data.bookingDetails ? `
            <div class="highlight-box">
                <h3>Informações Adicionais da Reserva</h3>
                <ul style="margin: 0 0 0 1.5rem;">
                    ${extraDetailsHtml}
                </ul>
            </div>
            ` : ''}
            
            <p><strong>Ação necessária:</strong> Acesse o painel de parceiro para confirmar ou gerenciar esta reserva.</p>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/admin/dashboard/reservas/" class="button">
                    Gerenciar Reserva
                </a>
            </div>
            
            <p>Lembre-se de confirmar a reserva o quanto antes para garantir uma boa experiência ao cliente.</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Portal do Parceiro</p>
            <p>📧 parceiros@tucanoronha.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para boas-vindas a novos usuários
export const getWelcomeNewUserTemplate = (data: any): string => {
  const roleMessages = {
    traveler: {
      title: "🏝️ Bem-vindo ao Viva Noronha!",
      message: "Estamos animados para ajudá-lo a descobrir as maravilhas de Fernando de Noronha!",
      features: [
        "🎯 Explore atividades exclusivas",
        "🏨 Reserve hospedagens incríveis", 
        "🍽️ Descubra restaurantes locais",
        "📱 Gerencie suas reservas facilmente"
      ]
    },
    partner: {
      title: "🤝 Bem-vindo, Parceiro!",
      message: "Obrigado por se juntar à nossa rede de parceiros em Fernando de Noronha!",
      features: [
        "📊 Gerencie suas ofertas",
        "📅 Controle suas reservas",
        "💰 Acompanhe seus ganhos",
        "📈 Analise performance"
      ]
    },
    employee: {
      title: "👋 Bem-vindo à Equipe!",
      message: "Estamos felizes em tê-lo como parte da equipe Viva Noronha!",
      features: [
        "🎯 Gerencie operações",
        "👥 Suporte aos clientes",
        "📋 Administre reservas",
        "📊 Relatórios e métricas"
      ]
    },
    master: {
      title: "🚀 Bem-vindo, Administrador!",
      message: "Você tem acesso completo à plataforma Viva Noronha!",
      features: [
        "🔧 Controle total do sistema",
        "👥 Gestão de usuários",
        "📊 Analytics avançados",
        "🏗️ Configurações gerais"
      ]
    }
  };

  const roleInfo = roleMessages[data.userRole as keyof typeof roleMessages] || roleMessages.traveler;

  const content = `
    <div class="container">
        <div class="header">
            <h1>${roleInfo.title}</h1>
            <p>${roleInfo.message}</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.userName}</strong>,</p>
            <p>Sua conta foi criada com sucesso! Agora você pode aproveitar todos os recursos da nossa plataforma.</p>
            
            <div class="highlight-box">
                <h3>O que você pode fazer:</h3>
                <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                    ${roleInfo.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <p><strong>Suas informações de acesso:</strong></p>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${data.userEmail}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tipo de Conta</div>
                    <div class="info-value">${data.userRole === 'traveler' ? 'Viajante' : 
                                              data.userRole === 'partner' ? 'Parceiro' :
                                              data.userRole === 'employee' ? 'Funcionário' : 'Administrador'}</div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/${data.userRole === 'traveler' ? 'meu-painel' : 'admin/dashboard'}" class="button">
                    Acessar Plataforma
                </a>
            </div>
            
            <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe de suporte está sempre disponível.</p>
            
            <p>Bem-vindo à família Viva Noronha! 🌺</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para proposta de pacote enviada - USAR O NOVO TEMPLATE MINIMALISTA
export const getPackageProposalTemplate = (data: any): string => {
  // Importar a função do arquivo packageRequests
  const { proposalSentTravelerEmail } = require("./templates/packageRequests");
  return proposalSentTravelerEmail({ proposalLink: data.proposalUrl });
};

// Template para início de reserva de voos
export const getPackageFlightBookingStartedTemplate = (data: any): string => {
  const content = `
    <div class="container">
        <div class="header">
            <h1>✈️ Reserva de Voos Iniciada</h1>
            <p>Estamos trabalhando na reserva dos seus voos</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.customerName}</strong>,</p>
            <p>Temos uma ótima notícia! Nossa equipe iniciou o processo de reserva dos voos para sua viagem.</p>
            
            <div class="highlight-box">
                <h3>Detalhes da Proposta</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Proposta</div>
                        <div class="info-value">#${data.proposalNumber}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Pacote</div>
                        <div class="info-value">${data.proposalTitle}</div>
                    </div>
                </div>
            </div>
            
            ${data.message ? `
            <div class="highlight-box success">
                <p style="margin: 0;"><strong>Mensagem da equipe:</strong></p>
                <p style="margin: 0.5rem 0 0 0;">${data.message}</p>
            </div>
            ` : ''}
            
            <p><strong>Próximos passos:</strong></p>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                <li>Nossa equipe está buscando as melhores opções de voos</li>
                <li>Você receberá um novo email assim que os voos forem confirmados</li>
                <li>Os detalhes completos dos voos serão compartilhados com você</li>
            </ul>
            
            <p>Estamos empenhados em garantir os melhores voos para sua viagem! 🛫</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para voos confirmados
export const getPackageFlightsConfirmedTemplate = (data: any): string => {
  const content = `
    <div class="container">
        <div class="header">
            <h1>🎉 Voos Confirmados!</h1>
            <p>Seus voos foram reservados com sucesso</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.customerName}</strong>,</p>
            <p>Excelente notícia! Os voos para sua viagem foram confirmados! ✈️</p>
            
            <div class="confirmation-code">
                Proposta #${data.proposalNumber}
            </div>
            
            <div class="highlight-box success">
                <h3>✈️ Detalhes dos Voos</h3>
                <div class="bg-white border border-green-200 rounded p-3">
                    <p style="margin: 0; white-space: pre-wrap;">${data.flightDetails}</p>
                </div>
            </div>
            
            <div class="highlight-box">
                <h3>Pacote</h3>
                <p style="margin: 0;">${data.proposalTitle}</p>
            </div>
            
            <p><strong>Próximos passos:</strong></p>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                <li>Nossa equipe está preparando toda a documentação da viagem</li>
                <li>Em breve você receberá os vouchers e informações completas</li>
                <li>Revise os detalhes dos voos e entre em contato se tiver dúvidas</li>
            </ul>
            
            <p>Sua viagem está cada vez mais próxima! Estamos ansiosos para proporcionar uma experiência inesquecível! 🏝️</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Template para documentos prontos
export const getPackageDocumentsReadyTemplate = (data: any): string => {
  const content = `
    <div class="container">
        <div class="header">
            <h1>📄 Documentos Prontos!</h1>
            <p>Sua documentação de viagem está disponível</p>
        </div>
        
        <div class="content">
            <p>Olá <strong>${data.customerName}</strong>,</p>
            <p>Temos uma novidade importante! Toda a documentação da sua viagem está pronta! 🎉</p>
            
            <div class="confirmation-code">
                Proposta #${data.proposalNumber}
            </div>
            
            <div class="highlight-box success">
                <h3>📋 Documentos Disponíveis</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Pacote</div>
                        <div class="info-value">${data.proposalTitle}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Documentos</div>
                        <div class="info-value">${data.documentCount} ${data.documentCount === 1 ? 'documento' : 'documentos'}</div>
                    </div>
                </div>
            </div>
            
            <p><strong>O que você precisa fazer agora:</strong></p>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                <li>Acesse sua conta no painel do viajante</li>
                <li>Revise todos os documentos com atenção</li>
                <li>Confirme se todas as informações estão corretas</li>
                <li>Dê sua confirmação final para prosseguirmos com o pagamento</li>
            </ul>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/meu-painel/pacotes" class="button">
                    Acessar Documentos
                </a>
            </div>
            
            <div class="highlight-box urgent">
                <p style="margin: 0;"><strong>⏰ Importante:</strong> Revise os documentos o quanto antes para não atrasar sua viagem!</p>
            </div>
            
            <p>Estamos quase lá! Qualquer dúvida, nossa equipe está à disposição. 🌴</p>
        </div>
        
        <div class="footer">
            <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
            <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "www.tuca-noronha.vercel.app"}</a></p>
        </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

// Função principal para obter template por tipo
export const getEmailTemplate = (data: EmailData): string => {
  switch (data.type) {
    case 'booking_confirmation':
      return bookingConfirmationEmail({ bookingLink: (data as any).bookingUrl || process.env.NEXT_PUBLIC_URL + '/meu-painel/reservas' });
    case 'booking_cancelled':
      return bookingCancelledEmail();
    case 'package_request_received':
      return packageRequestReceivedTravelerEmail();
    case 'package_proposal_sent':
      return proposalSentTravelerEmail({ proposalLink: (data as any).proposalUrl });
    case 'package_flight_booking_started':
      return flightBookingStartedTravelerEmail();
    case 'package_flights_confirmed':
      return flightsConfirmedTravelerEmail();
    case 'package_documents_ready':
      return documentsReadyTravelerEmail();
    case 'partner_new_booking':
      return partnerNewBookingEmail({ bookingLink: (data as any).bookingUrl || process.env.NEXT_PUBLIC_URL + '/meu-painel/reservas' });
    case 'welcome_new_user':
      return welcomeNewUserEmail();
    case 'voucher_ready':
      if (data.type === 'voucher_ready') {
        return voucherEmailTemplate(data as any);
      }
      // Fallback for type mismatch, though it shouldn't happen with proper type guarding
      return getBaseTemplate('<p>Error: Invalid data for voucher email.</p>');
    case 'package_request_admin':
      return newPackageRequestAdminEmail();
    case 'package_proposal_accepted_admin':
      return proposalAcceptedAdminEmail();
    case 'package_proposal_rejected_admin':
      return proposalRejectedAdminEmail();
    case 'package_proposal_revision_admin':
      return proposalRevisionRequestedAdminEmail();
    case 'package_proposal_sent_traveler':
      return proposalSentTravelerEmail(data as any);
    default:
      // Template genérico para tipos não implementados
      return getBaseTemplate(`
        <div class="container">
            <div class="header">
                <h1>Viva Noronha</h1>
                <p>Notificação importante</p>
            </div>
            <div class="content">
                <p>Você recebeu uma notificação do Viva Noronha.</p>
                <p>Entre em contato conosco se precisar de ajuda.</p>
            </div>
            <div class="footer">
                <p>Viva Noronha - Sua experiência em Fernando de Noronha</p>
                <p>📧 atendimentotucanoronha@gmail.com | 📱 (81) 979097547</p>
            </div>
        </div>
      `);
  }
}

// Export all minimalista templates
export {
  // Admin emails
  newPackageRequestAdminEmail,
  proposalAcceptedAdminEmail,
  proposalRejectedAdminEmail,
  proposalRevisionRequestedAdminEmail,
  // Traveler emails
  proposalSentTravelerEmail,
  packageRequestReceivedTravelerEmail,
  flightBookingStartedTravelerEmail,
  flightsConfirmedTravelerEmail,
  documentsReadyTravelerEmail,
  // Booking emails
  bookingConfirmationEmail,
  bookingCancelledEmail,
  // User emails
  welcomeNewUserEmail,
  // Partner emails
  partnerNewBookingEmail,
}; 