import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Authentifizierungsfehler</h1>
        <p className="mt-2 text-muted-foreground">
          Bei der Anmeldung ist ein Fehler aufgetreten.
        </p>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Erneut versuchen</Link>
        </Button>
      </div>
    </div>
  )
}
