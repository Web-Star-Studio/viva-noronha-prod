/**
 * @deprecated This file is deprecated. Import from '@/lib/hooks/useCurrentUser' instead.
 */

import { useCurrentUser as CurrentUserHook } from "@/lib/hooks/useCurrentUser";
import { useEffect } from "react";

// Re-export the simpler implementation from the new location
export const useCurrentUser = CurrentUserHook;

// Re-export the type for backward compatibility
export interface CurrentUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  phone?: string;
  isLoading: boolean;
  isSignedIn: boolean;
  // Campos específicos do Convex
  convexId?: string; // ID interno do Convex (se existir)
  convexData?: Record<string, unknown>;   // Dados adicionais do usuário no Convex
}

/**
 * @deprecated Use useAuth from '@/lib/auth' instead.
 */
export function useIsAuthenticated(): {
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { isAuthenticated, isLoading } = CurrentUserHook();
  return { isAuthenticated: !!isAuthenticated, isLoading };
}

/**
 * @deprecated Use useAuth from '@/lib/auth' instead.
 */
export function useRequireAuth(redirectUrl?: string) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("useRequireAuth is deprecated. Use useAuth from @/lib/auth instead.");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  return {
    isReady: !isLoading,
    isAuthenticated,
    isLoading,
  };
}
