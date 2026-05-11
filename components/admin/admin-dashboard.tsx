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
} from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
    const { productos, isLoading, listarProductos, obtenerProductosBajoStock } =
        useProductosStore();

    useEffect(() => {
        listarProductos();
    }, []);

    const productosBajoStock = obtenerProductosBajoStock();
    const valorTotal = productos?.reduce(
            (sum, product) =>
                sum + product.precio_venta_minorista * product.stock,
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

                    <div className="neo-card p-2 space-y-2 hover:shadow-[6px_6px_0px_0px_theme(colors.border)] transition-all duration-200">
                        <Link href="/admin/ventas/nueva-venta">
                            <Button
                                className="w-full neo-button font-bold flex justify-center items-center py-8"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                <Plus className="w-8 h-8 text-white font-extrabold" />
                                Nueva Venta
                            </Button>
                        </Link>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                {productosBajoStock.length > 0
                                    ? `${productosBajoStock.length} productos necesitan re-stock`
                                    : "Todos los productos en stock"}
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

                        <Link
                            href="/admin/productos/agregar"
                            className="neo-card p-6 space-y-4 hover:shadow-[6px_6px_0px_0px_theme(colors.border)] transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <Plus className="w-8 h-8 text-primary" />
                                <h2
                                    className="neo-heading text-xl"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    Agregar Producto
                                </h2>
                            </div>
                            <p className="text-muted-foreground">
                                Agrega nuevos productos a tu inventario
                            </p>
                            <Button
                                className="w-full neo-button font-bold"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                Agregar Producto
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
