import type { Metadata } from "next";
import PackageDetailPageClient from "@/app/pacotes/[slug]/PackageDetailPageClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatSlugTitle(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const packageName = formatSlugTitle(slug);

  return {
    title: `${packageName} | Pacotes | Viva Noronha`,
    description:
      "Explore roteiro, benefícios, avaliações e mídia do pacote antes de seguir para a reserva.",
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <PackageDetailPageClient slug={slug} />;
}
