import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b-4 border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary neo-button"></div>
            <span className="neo-heading text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              SAADE MOTOS
            </span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              className="neo-button font-semibold bg-transparent"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ADMIN LOGIN
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
