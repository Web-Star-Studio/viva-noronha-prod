import type { Metadata } from "next";
import { PackageRequestDetailsPageClient } from "@/components/dashboard/package-request-details/PackageRequestDetailsPageClient";

interface PackageRequestDetailsPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Detalhes da Solicitação de Pacote | Admin",
  description: "Visualize e gerencie uma solicitação de pacote personalizada.",
};

export default async function PackageRequestDetailsPage({ params }: PackageRequestDetailsPageProps) {
  const { requestId } = await params;
  return <PackageRequestDetailsPageClient requestId={requestId} />;
}

