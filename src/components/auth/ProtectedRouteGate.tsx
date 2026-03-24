"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { RouteGateState } from "@/components/auth/RouteGateState";

const ALLOWED_ROLES = new Set(["traveler", "partner", "employee", "master"]);
const GUIDE_ROUTE = "/meu-painel/guia";

export function ProtectedRouteGate({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const isGuideRoute =
    pathname === GUIDE_ROUTE || pathname.startsWith(`${GUIDE_ROUTE}/`);
  const lastDeniedRoleRef = useRef<string | null>(null);

  useEffect(() => {
    if (isGuideRoute || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    if (user === null) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isGuideRoute, isLoading, router, user]);

  useEffect(() => {
    const userRole = user?.role || "traveler";
    if (!isGuideRoute && user && !ALLOWED_ROLES.has(userRole) && lastDeniedRoleRef.current !== userRole) {
      lastDeniedRoleRef.current = userRole;
      toast.error("Papel de usuário não reconhecido.", {
        id: "protected-route-gate-denied",
        description: "Entre em contato com o suporte se o problema persistir.",
      });
    }
  }, [isGuideRoute, user]);

  if (isGuideRoute) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated || user === null || user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Verificando permissões...</div>
      </div>
    );
  }

  if (!ALLOWED_ROLES.has(user.role || "traveler")) {
    return (
      <RouteGateState
        title="Papel de Usuário Não Reconhecido"
        description="Seu papel de usuário não foi reconhecido pelo sistema. Entre em contato com o suporte para resolver este problema."
        primaryHref="/"
        primaryLabel="Ir para a Home"
      />
    );
  }

  return <>{children}</>;
}
