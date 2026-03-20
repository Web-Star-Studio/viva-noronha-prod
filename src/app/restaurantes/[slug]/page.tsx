import type { Metadata } from "next";
import RestaurantPageClient from "@/app/restaurantes/[slug]/RestaurantPageClient";

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
  const restaurantName = formatSlugTitle(slug);

  return {
    title: `${restaurantName} | Restaurantes | Viva Noronha`,
    description:
      "Consulte cardápio, avaliações, galeria e formas de reserva para restaurantes em Fernando de Noronha.",
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;

  return <RestaurantPageClient slug={slug} />;
}
