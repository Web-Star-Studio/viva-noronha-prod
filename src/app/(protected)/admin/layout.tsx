import type { ReactNode } from "react";
import { AdminRouteGate } from "@/components/auth/AdminRouteGate";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminRouteGate>{children}</AdminRouteGate>;
}
