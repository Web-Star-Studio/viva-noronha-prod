import type { Metadata } from "next";
import VehiclePageClient from "@/app/veiculos/[id]/VehiclePageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Veículo | Viva Noronha",
  description:
    "Confira detalhes, fotos, avaliações e disponibilidade de veículos para alugar em Fernando de Noronha.",
};

export default async function VehiclePage({ params }: PageProps) {
  const { id } = await params;

  return <VehiclePageClient vehicleId={id} />;
}
