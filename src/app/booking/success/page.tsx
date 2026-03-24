import type { Metadata } from "next";
import BookingSuccessPageClient from "@/app/booking/success/BookingSuccessPageClient";

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
  title: "Reserva Confirmada | Viva Noronha",
  description:
    "Confira o status do pagamento, detalhes da reserva e links para voucher ou comprovante.",
};

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bookingCode =
    getFirstParam(params.booking_id) ?? getFirstParam(params.bookingId);
  const bookingType = getFirstParam(params.type);

  return (
    <BookingSuccessPageClient
      bookingCode={bookingCode}
      bookingType={bookingType}
    />
  );
}
