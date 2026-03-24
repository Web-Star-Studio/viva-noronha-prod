import type { Metadata } from "next";
import ActivityPageClient from "@/app/atividades/[id]/ActivityPageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Atividade | Viva Noronha",
  description:
    "Veja detalhes da atividade, avaliações, galeria e disponibilidade antes de concluir sua reserva em Fernando de Noronha.",
};

export default async function ActivityPage({ params }: PageProps) {
  const { id } = await params;

  return <ActivityPageClient activityId={id} />;
}
