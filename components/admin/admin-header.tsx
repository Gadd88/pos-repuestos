"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Plus, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminHeader() {
    const { logout, usuario } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <>
            {usuario ? (
                <header className="border-b-4 border-border bg-card">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between w-full gap-6">
                                {pathname !== "/inactivo" && (
                                    <nav className="flex items-center md:gap-8">
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-8 h-8 bg-sky-500 neo-button"></div>
                                            <span
                                                className="neo-heading text-xl"
                                                style={{
                                                    fontFamily:
                                                        "var(--font-montserrat)",
                                                }}
                                            >
                                                {usuario?.nombreNegocio ||
                                                    "POS - RespuestoStock"}
                                            </span>
                                        </Link>
                                        <div className="hidden md:flex items-center gap-4">
                                            <Link href="/admin/stock">
                                                <Button
                                                    variant="ghost"
                                                    className="neo-button font-semibold bg-transparent"
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-montserrat)",
                                                    }}
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    INVENTARIO
                                                </Button>
                                            </Link>
                                            <Link href="/admin/ventas/nueva-venta">
                                                <Button
                                                    variant="ghost"
                                                    className="neo-button font-semibold bg-sky-500"
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-montserrat)",
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    NUEVA VENTA
                                                </Button>
                                            </Link>
                                            {usuario?.rol === "superadmin" && (
                                                <Link href="/admin/super">
                                                    <Button
                                                        variant="ghost"
                                                        className="neo-button font-semibold bg-lime-500"
                                                        style={{
                                                            fontFamily:
                                                                "var(--font-montserrat)",
                                                        }}
                                                    >
                                                        Super Admin
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </nav>
                                )}
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="neo-button font-semibold bg-red-500"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
            ) : (
                <header className="border-b-4 border-border bg-card">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary neo-button"></div>
                                <span
                                    className="neo-heading text-xl"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    POS - RepuestoStock
                                </span>
                            </Link>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
}
