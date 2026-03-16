import type { VoucherEmailData } from "../types";

export const voucherEmailTemplate = (data: VoucherEmailData): string => {
  const voucherUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/voucher/${data.confirmationCode}`;
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu Voucher Está Pronto - ${data.voucherNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .voucher-box {
      background: #f8f9fa;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
    }
    .voucher-number {
      font-size: 24px;
      font-weight: bold;
      color: #1e3c72;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .confirmation-code {
      font-size: 18px;
      color: #666;
      margin: 5px 0;
      font-family: 'Courier New', monospace;
    }
    .booking-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .booking-details h3 {
      margin-top: 0;
      color: #1e3c72;
      font-size: 18px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #495057;
    }
    .detail-value {
      color: #212529;
    }
    .cta-button {
      display: inline-block;
      background: #1e3c72;
      color: white !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 5px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background: #2a5298;
    }
    .instructions {
      background: #e7f3ff;
      border-left: 4px solid #1e3c72;
      padding: 15px 20px;
      margin: 20px 0;
    }
    .instructions h4 {
      margin: 0 0 10px 0;
      color: #1e3c72;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    .footer a {
      color: #1e3c72;
      text-decoration: none;
    }
    .icon {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Seu Voucher Está Pronto!</h1>
      <p>Sua reserva foi confirmada com sucesso</p>
    </div>
    
    <div class="content">
      <p>Olá <strong>${data.customerName}</strong>,</p>
      
      <p>Ótimas notícias! Sua reserva foi confirmada e seu voucher está pronto para uso.</p>
      
      <div class="voucher-box">
        <p style="margin: 0; color: #6c757d;">Número do Voucher</p>
        <div class="voucher-number">${data.voucherNumber}</div>
        <div class="confirmation-code">Código: ${data.confirmationCode}</div>
      </div>
      
      <div class="booking-details">
        <h3>Detalhes da Reserva</h3>
        <div class="detail-row">
          <span class="detail-label">Serviço:</span>
          <span class="detail-value">${data.assetName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tipo:</span>
          <span class="detail-value">${getBookingTypeLabel(data.bookingType)}</span>
        </div>
        ${data.bookingDate ? `
        <div class="detail-row">
          <span class="detail-label">Data:</span>
          <span class="detail-value">${data.bookingDate}</span>
        </div>
        ` : ''}
        ${data.totalPrice ? `
        <div class="detail-row">
          <span class="detail-label">Valor Total:</span>
          <span class="detail-value">${formatCurrency(data.totalPrice)}</span>
        </div>
        ` : ''}
        ${data.partnerName ? `
        <div class="detail-row">
          <span class="detail-label">Fornecedor:</span>
          <span class="detail-value">${data.partnerName}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="instructions">
        <h4>📋 Próximos Passos</h4>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Clique no botão abaixo para visualizar e baixar seu voucher</li>
          <li>Salve o PDF em seu dispositivo ou imprima uma cópia</li>
          <li>Apresente o voucher no estabelecimento na data da reserva</li>
          <li>Aproveite sua experiência em Fernando de Noronha!</li>
        </ol>
      </div>
      
      <div style="text-align: center;">
        <a href="${voucherUrl}" class="cta-button">
          📄 Acessar Meu Voucher
        </a>
      </div>
      
      <p style="color: #6c757d; font-size: 14px; text-align: center;">
        Você também pode acessar o voucher através do link:<br>
        <a href="${voucherUrl}" style="color: #1e3c72;">${voucherUrl}</a>
      </p>
      
      ${renderBookingSpecificInfo(data.bookingType, data.bookingDetails)}
    </div>
    
    <div class="footer">
      <p>
        Este é um e-mail automático. Por favor, não responda.<br>
        Em caso de dúvidas, entre em contato conosco através do site.
      </p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}">${process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : "tuca-noronha.vercel.app"}</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://tuca-noronha.vercel.app"}/ajuda">Central de Ajuda</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} Viva Noronha. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

function getBookingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    activity: "Atividade",
    event: "Evento",
    restaurant: "Restaurante",
    vehicle: "Veículo",
    package: "Pacote",
    accommodation: "Hospedagem",
  };
  return labels[type] || type;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function renderBookingSpecificInfo(bookingType: string, details: any): string {
  if (!details) return "";
  
  switch (bookingType) {
    case "activity":
      return `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <h4 style="color: #1e3c72; margin-bottom: 10px;">ℹ️ Informações Importantes</h4>
          ${details.meetingPoint ? `<p><strong>Ponto de Encontro:</strong> ${details.meetingPoint}</p>` : ''}
          ${details.duration ? `<p><strong>Duração:</strong> ${details.duration}</p>` : ''}
          ${details.includes && details.includes.length > 0 ? `
            <p><strong>O que está incluso:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${details.includes.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          ` : ''}
          <p style="color: #6c757d; font-size: 14px;">
            Por favor, chegue com 15 minutos de antecedência.
          </p>
        </div>
      `;
      
    case "restaurant":
      return `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <h4 style="color: #1e3c72; margin-bottom: 10px;">🍽️ Informações da Reserva</h4>
          <p>Sua mesa está reservada para <strong>${details.partySize} ${details.partySize === 1 ? 'pessoa' : 'pessoas'}</strong>.</p>
          <p style="color: #6c757d; font-size: 14px;">
            Em caso de atraso superior a 15 minutos, por favor entre em contato com o restaurante.
          </p>
        </div>
      `;
      
    case "vehicle":
      return `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <h4 style="color: #1e3c72; margin-bottom: 10px;">🚗 Informações da Locação</h4>
          <p><strong>Modelo:</strong> ${details.vehicleModel || 'A ser confirmado'}</p>
          <p><strong>Local de Retirada:</strong> ${details.pickupLocation}</p>
          <p><strong>Local de Devolução:</strong> ${details.returnLocation}</p>
          <p style="color: #6c757d; font-size: 14px;">
            Lembre-se de levar sua CNH válida e um cartão de crédito para o caução.
          </p>
        </div>
      `;
      
    default:
      return "";
  }
} 