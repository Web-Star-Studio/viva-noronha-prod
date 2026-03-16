"use node";

import { EmailConfig } from "./types";

// Configuração principal de email
export const getEmailConfig = (): EmailConfig => {
  // Verificar se variáveis SMTP estão configuradas
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // Debug das variáveis de ambiente
  console.log("🔍 Email Config Debug:");
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST ? '✅ Set' : '❌ Missing'}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '✅ Set' : '❌ Missing'}`);
  console.log(`Has SMTP Config: ${hasSmtpConfig ? '✅ Yes' : '❌ No'}`);
  
  // Se tem configuração SMTP, usar ela independente do ambiente
  if (hasSmtpConfig) {
    console.log("🚀 Using real SMTP configuration");
    return {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      from: {
        name: process.env.EMAIL_FROM_NAME || "Viva Noronha",
        email: process.env.EMAIL_FROM || "noreply@tucanoronha.com",
      },
    };
  }
  
  if (isDevelopment) {
    // Configuração para desenvolvimento usando Ethereal Email (teste)
    console.log("🧪 Using Ethereal Email for development");
    return {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "ethereal.user@ethereal.email",
        pass: process.env.EMAIL_PASS || "ethereal.password",
      },
      from: {
        name: "Viva Noronha - Dev",
        email: process.env.EMAIL_FROM || "dev@tucanoronha.com",
      },
    };
  }
  
  // Fallback para produção sem configuração SMTP
  console.log("⚠️ No SMTP configuration found, using default Gmail settings");
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || "Viva Noronha",
      email: process.env.EMAIL_FROM || "noreply@tucanoronha.com",
    },
  };
};

// Emails importantes do sistema
export const SYSTEM_EMAILS = {
  ADMIN: process.env.ADMIN_EMAIL || "admin@tucanoronha.com",
  SUPPORT: process.env.SUPPORT_EMAIL || "suporte@tucanoronha.com",
  NO_REPLY: process.env.NO_REPLY_EMAIL || "noreply@tucanoronha.com",
  MASTER: process.env.MASTER_EMAIL || "master@tucanoronha.com",
} as const;

// Configurações específicas por tipo de email
export const EMAIL_SETTINGS = {
  booking_confirmation: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  booking_cancelled: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  booking_reminder: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_request_received: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_request_admin: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_request_status_update: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_proposal_sent: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_flight_booking_started: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_flights_confirmed: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_documents_ready: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  partner_new_booking: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  welcome_new_user: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  new_partner_registration: {
    priority: "normal" as const,
    cc: [SYSTEM_EMAILS.ADMIN, SYSTEM_EMAILS.MASTER],
  },
  employee_invitation: {
    priority: "normal" as const,
    replyTo: SYSTEM_EMAILS.ADMIN,
  },
  support_message: {
    priority: "high" as const,
    cc: [SYSTEM_EMAILS.SUPPORT],
  },
  package_proposal_sent_traveler: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_proposal_accepted_admin: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_proposal_rejected_admin: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  package_proposal_revision_admin: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  booking_approved: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
  booking_rejected: {
    priority: "high" as const,
    replyTo: SYSTEM_EMAILS.SUPPORT,
  },
} as const; 