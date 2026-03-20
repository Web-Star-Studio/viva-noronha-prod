import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">
          Pacote não encontrado
        </h1>
        <p className="mb-8 text-slate-600">
          O pacote solicitado não existe mais ou o endereço informado é inválido.
        </p>
        <Button asChild>
          <Link href="/pacotes">Voltar para Pacotes</Link>
        </Button>
      </div>
    </div>
  );
}
