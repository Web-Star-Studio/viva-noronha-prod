import type { Metadata } from "next";
import PaymentSuccessPageClient from "@/app/pagamento/sucesso/PaymentSuccessPageClient";

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
  title: "Pagamento Aprovado | Viva Noronha",
  description:
    "Revise o pagamento aprovado, próximos passos da viagem e os canais de suporte.",
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <PaymentSuccessPageClient
      paymentId={getFirstParam(params.payment_id)}
      status={getFirstParam(params.status)}
      preferenceId={getFirstParam(params.preference_id)}
    />
  );
}
