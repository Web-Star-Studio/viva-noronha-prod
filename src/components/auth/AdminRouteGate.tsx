"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { RouteGateState } from "@/components/auth/RouteGateState";

const ADMIN_ALLOWED_ROLES = new Set(["partner", "employee", "master"]);

export function AdminRouteGate({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const role = user?.role ?? "traveler";

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    if (user === null) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => {
    if (user && !ADMIN_ALLOWED_ROLES.has(role)) {
      toast.error("Você não tem permissão para acessar a área administrativa.", {
        description: "Área restrita a parceiros, funcionários e administradores.",
      });
    }
  }, [role, user]);

  if (isLoading || !isAuthenticated || user === null || user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <div className="text-slate-600">Verificando permissões administrativas...</div>
        </div>
      </div>
    );
  }

  if (!ADMIN_ALLOWED_ROLES.has(role)) {
    return (
      <RouteGateState
        title="Acesso Negado - Área Administrativa"
        description="Você não tem permissões para acessar a área administrativa. Este conteúdo é restrito a parceiros, funcionários e administradores do sistema."
        primaryHref="/meu-painel"
        primaryLabel="Ir para Meu Painel"
        secondaryHref="/"
        secondaryLabel="Ir para a Home"
      />
    );
  }

  return <>{children}</>;
}
