import type { ReactNode } from "react";
import { ProtectedRouteGate } from "@/components/auth/ProtectedRouteGate";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedRouteGate>{children}</ProtectedRouteGate>;
}
