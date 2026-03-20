import type { Metadata } from "next";
import SubscriptionSuccessPageClient from "@/app/(protected)/meu-painel/guia/sucesso/SubscriptionSuccessPageClient";

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
  title: "Assinatura Ativada | Viva Noronha",
  description:
    "Confirme a ativação da sua assinatura do guia e acesse o conteúdo exclusivo.",
};

export default async function SubscriptionSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <SubscriptionSuccessPageClient
      preapprovalId={getFirstParam(params.preapproval_id)}
      externalReference={getFirstParam(params.external_reference)}
    />
  );
}
