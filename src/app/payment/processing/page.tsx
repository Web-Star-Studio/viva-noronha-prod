import type { Metadata } from "next";
import PaymentProcessingPageClient from "@/app/payment/processing/PaymentProcessingPageClient";

type SearchParamValue = string | string[] | undefined;
type PageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

function getFirstParam(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export const metadata: Metadata = {
  title: "Processando Pagamento | Viva Noronha",
  description:
    "Acompanhe a criação da preferência de pagamento antes de seguir para o checkout.",
};

export default async function PaymentProcessingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <PaymentProcessingPageClient
      proposalId={getFirstParam(params.proposal_id)}
      preferenceId={getFirstParam(params.preference_id)}
    />
  );
}
