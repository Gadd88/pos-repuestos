"use client"

import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { LogOut, Package, Plus, Home } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export function AdminHeader() {
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    redirect("/login")
  }

  return (
    <header className="border-b-4 border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-500 neo-button"></div>
              <span className="neo-heading text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
                POS - RepuestoStock
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              {/* <Link href="/admin">
                <Button
                  variant="ghost"
                  className="neo-button font-semibold bg-transparent"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  DASHBOARD
                </Button>
              </Link> */}
              <Link href="/admin/stock">
                <Button
                  variant="ghost"
                  className="neo-button font-semibold bg-transparent"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <Package className="w-4 h-4 mr-2" />
                  INVENTARIO
                </Button>
              </Link>
              <Link href="/admin/ventas/nueva-venta">
                <Button
                  variant="ghost"
                  className="neo-button font-semibold bg-sky-500"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  NUEVA VENTA
                </Button>
              </Link>
            </nav>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="neo-button font-semibold bg-red-500"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <LogOut className="w-4 h-4 mr-2" />
              </Button>
            {/* <div className="neo-card flex items-center gap-4">
            </div> */}
          </div>
        </div>
      </div>
    </header>
  )
}
