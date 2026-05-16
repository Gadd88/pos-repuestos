import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"

export default async function LoginPage() {

  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if(session) redirect("/admin")
    
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-4 border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary neo-button"></div>
              <span className="neo-heading text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
                POS - RepuestoStock
              </span>
            </Link>
            <Link href="/registro">
              <Button
                variant="outline"
                className="neo-button font-semibold bg-transparent"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Registrarse
              </Button>
            </Link>
            {/* <Link href="/">
              <Button
                variant="outline"
                className="neo-button font-semibold bg-transparent"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                VOLVER
              </Button>
            </Link> */}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="neo-heading text-4xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              Inicia sesión en tu cuenta
            </h1>
            <p className="text-muted-foreground">Ingresa a tu sistema de stock</p>
          </div>
          <LoginForm />
          <p>Aun no tienes cuenta? <Link href="/registro" className="text-primary hover:underline">Regístrate aquí</Link></p>
        </div>
      </main>
    </div>
  )
}
