"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type RouteGateStateProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon?: ReactNode;
};

export function RouteGateState({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon,
}: RouteGateStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mx-auto max-w-md p-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            {icon ?? <ShieldAlert className="h-12 w-12 text-red-600" />}
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mb-8 text-slate-600">{description}</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>

          {secondaryHref && secondaryLabel ? (
            <Button variant="outline" asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
