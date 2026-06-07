"use client";

import { useEffect } from "react";
import { useProductosStore } from "@/lib/stores/products-store";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import {
    Package,
    Plus,
    TrendingUp,
    AlertTriangle,
    Loader2,
    Receipt,
    User,
    Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AdminDashboard() {
    const { productos, isLoading, listarProductos, obtenerProductosBajoStock } =
        useProductosStore();

    const { usuario } = useAuthStore();

    useEffect(() => {
        listarProductos();
    }, []);

    const productosBajoStock = obtenerProductosBajoStock();
    const valorTotal = productos?.reduce(
        (sum, product) => sum + product.precio_venta_minorista * product.stock,
        0,
    );
    const stockTotal = productos?.reduce(
        (sum, product) => sum + product.stock,
        0,
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <AdminHeader />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="text-muted-foreground">
                                Cargando dashboard...
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <h1
                            className="neo-heading text-4xl md:text-6xl mb-4"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            DASHBOARD
                        </h1>
                    </div>

                    <div
                        className={`neo-card p-2 grid ${usuario?.rol === "superadmin" ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-2 hover:shadow-[6px_6px_0px_0px_theme(colors.border)] transition-all duration-200`}
                    >
                        <Link href="/admin/ventas/nueva-venta">
                            <Button
                                variant="ghost"
                                className="w-full bg-sky-500 neo-button font-bold flex justify-center items-center py-6"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                <Plus className="w-8 h-8 text-white font-black" />
                                Nueva Venta
                            </Button>
                        </Link>
                        {usuario?.rol === "superadmin" && (
                            <Link href="/admin/super">
                                <Button
                                    variant="ghost"
                                    className="w-full neo-button font-semibold bg-lime-500 py-6"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    <User className="w-8 h-8 text-white" />
                                    Super Admin
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="neo-card p-2 lg:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-8 h-8 text-primary" />
                                <div>
                                    <div
                                        className="neo-heading text-xl"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        {productos.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total de Productos
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="neo-card p-2 lg:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                                <div>
                                    <div
                                        className="neo-heading text-xl text-red-600"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        {productosBajoStock.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Productos con Bajo/Sin Stock
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="neo-card p-2 lg:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                                <div>
                                    <div
                                        className="neo-heading text-xl text-green-600"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        {stockTotal}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Productos en Total
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="neo-card p-2 lg:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-8 h-8 text-sky-500" />
                                <div>
                                    <div
                                        className="neo-heading text-xl text-sky-500"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        ${valorTotal.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Valor del Inventario
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="neo-card p-6 space-y-4 hover:shadow-[6px_6px_0px_0px_theme(colors.border)] transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <Package className="w-8 h-8 text-sky-500" />
                                <h2
                                    className="neo-heading text-xl"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Administrar Stock
                                </h2>
                            </div>
                            <p className="text-muted-foreground">
                                Revisa, edita y borra productos de tu inventario
                            </p>
                            <Link href="/admin/stock">
                                <Button
                                    className="w-full neo-button font-bold bg-sky-500"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Abrir Stock
                                </Button>
                            </Link>
                        </div>
                        <div className="neo-card p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Receipt className="w-8 h-8 text-green-500" />
                                <h2
                                    className="neo-heading text-xl"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Histórico de ventas
                                </h2>
                            </div>
                            <p className="text-muted-foreground">
                                Revisa el histórico de ventas realizadas y sus
                                detalles
                            </p>

                            <Link href="/admin/ventas">
                                <Button
                                    className="w-full neo-button font-bold bg-green-600"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Ver Ventas
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="neo-card p-6 space-y-4 max-h-64">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                            <h2
                                className="neo-heading text-xl"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                Productos con Bajo Stock
                            </h2>
                        </div>

                        {productosBajoStock.length > 0 ? (
                            <ul className="text-sm text-muted-foreground mb-4 overflow-auto flex flex-wrap gap-1">
                                {productosBajoStock.map((prod) => (
                                    <li key={prod.id} className="font-semibold">
                                        <Badge
                                            variant="secondary"
                                            className="bg-yellow-400 text-black border-black"
                                        >
                                            {prod.nombre} - {prod.stock}u.
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">
                                Todos los productos con stock mínimo o
                                suficiente.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
