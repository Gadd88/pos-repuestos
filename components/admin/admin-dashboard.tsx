"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Package,
    Plus,
    AlertTriangle,
    Loader2,
    Receipt,
    User,
    Users,
    ArrowUpDown,
    ChartCandlestick,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useListarProductos } from "@/features/productos/useProductos";
import { ProductosBajoStock } from "./productos-bajo-stock";

export function AdminDashboard() {
    const { data: productos = [], isLoading } = useListarProductos();

    const { usuario } = useAuthStore();

    const productosBajoStock = useMemo(
        () => productos.filter((producto) => producto.stock <= 2),
        [productos],
    );

    const valorTotal = useMemo(
        () =>
            productos?.reduce(
                (sum, product) =>
                    sum + product.precio_venta_minorista * product.stock,
                0,
            ),
        [productos],
    );

    const esAdmin = usuario?.rol === "admin";

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-muted-foreground">
                            Cargando dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
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
                    className={`grid ${usuario?.rol === "superadmin" ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-2 transition-all duration-200`}
                >
                    <Link href="/admin/ventas/nueva-venta">
                        <Button
                            variant="ghost"
                            className="w-full bg-sky-500 neo-button font-bold flex justify-center items-center py-6 overflow-hidden text-white hover:text-black"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <Plus className="size-12 sm:size-20 stroke-2 rounded-full border" />
                            Nueva Venta
                        </Button>
                    </Link>
                    {usuario?.rol === "superadmin" && (
                        <Link href="/admin/super">
                            <Button
                                variant="ghost"
                                className="w-full neo-button font-semibold bg-lime-500 py-6 overflow-hidden text-white"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                <User className="size-12 sm:size-20 rounded-full border" />
                                Super Admin
                            </Button>
                        </Link>
                    )}
                </div>

                <div
                    className={`grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6`}
                >
                    <div className="neo-card p-2 lg:p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-primary" />
                            <div>
                                <div
                                    className="neo-heading text-xl"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
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
                                        fontFamily: "var(--font-montserrat)",
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

                    <div className="neo-card p-2 lg:p-6 space-y-4 col-span-2 lg:col-auto">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-sky-500" />
                            <div>
                                <div
                                    className="neo-heading text-xl text-sky-500"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-default">
                    <div className={`grid grid-cols-1 ${!esAdmin ? "md:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
                        {usuario?.rol === "admin" && (
                            <div className="neo-card p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_var(--color-border)] transition-all duration-200 grid grid-rows-3">
                                <div className="flex items-center gap-3">
                                    <Users className="w-8 h-8 text-purple-500" />
                                    <h2 className="neo-heading text-xl">
                                        Vendedores
                                    </h2>
                                </div>
                                <p className="text-muted-foreground">
                                    Administra tus vendedores
                                </p>

                                <Link href="/admin/usuarios">
                                    <Button className="w-full neo-button font-bold bg-purple-600 hover:bg-purple-500">
                                        Gestionar
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <div className="neo-card p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_var(--color-border)] transition-all duration-200 grid grid-rows-3">
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
                                    className="w-full neo-button font-bold bg-sky-600 hover:bg-sky-500"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Abrir Stock
                                </Button>
                            </Link>
                        </div>
                        <div className="neo-card p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_var(--color-border)] transition-all duration-200 grid grid-rows-3">
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
                                    className="w-full neo-button font-bold bg-green-600 hover:bg-green-500"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Ver Ventas
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="container border-2 p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,.7)]">
                        <h2 className="neo-heading text-xl">AUDITORÍA</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="neo-card p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_var(--color-border)] transition-all duration-200 grid grid-rows-3">
                                <div className="flex items-center gap-3">
                                    <ArrowUpDown className="w-8 h-8 text-orange-500" />
                                    <h2
                                        className="neo-heading text-xl"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        Movimientos de Stock
                                    </h2>
                                </div>
                                <p className="text-muted-foreground">
                                    Detalle de los movimientos de stock
                                    registrados.
                                </p>

                                <Link href="/admin/movimientos-stock">
                                    <Button
                                        className="w-full neo-button font-bold bg-orange-600 hover:bg-orange-500"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        Ver Movimientos
                                    </Button>
                                </Link>
                            </div>
                            <div className="neo-card p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_var(--color-border)] transition-all duration-200 grid grid-rows-3">
                                <div className="flex items-center gap-3">
                                    <ChartCandlestick className="w-8 h-8 text-primary" />
                                    <h2
                                        className="neo-heading text-xl"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        Resumen de Caja
                                    </h2>
                                </div>
                                <p className="text-muted-foreground">
                                    Resumen de ventas diario.
                                </p>

                                <Link href="/admin/resumen-caja">
                                    <Button
                                        className="w-full neo-button font-bold bg-primary"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        Ver Resumen
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <ProductosBajoStock productosBajoStock={productosBajoStock}/>
                
            </div>
        </div>
    );
}
