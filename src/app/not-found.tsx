import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold text-slate-900">
          Não encontramos esta página
        </h1>
        <p className="mb-8 text-slate-600">
          O conteúdo pode ter sido removido ou o link informado não existe mais.
        </p>
        <Button asChild>
          <Link href="/">Voltar para a Home</Link>
        </Button>
      </div>
    </div>
  );
}
