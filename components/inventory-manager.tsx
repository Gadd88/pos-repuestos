"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductDeleteDialog } from "@/components/producto/product-delete-dialog";
import { Plus, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductCardStock } from "./producto/product-card-stock";
import { InputBusqueda } from "./input-busqueda";
import { ProductoType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useBusquedaProductos } from "@/hooks/useBusquedaProducto";

export function InventoryManager() {
    const { usuario } = useAuthStore();
    const [deleteProducto, setDeleteProducto] = useState<
        ProductoType | null
    >(null);

    const { query, setQuery, filteredProducts, productos, isLoading, error } =
        useBusquedaProductos();

    const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error inesperado";

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-muted-foreground">
                            Cargando inventario...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1
                            className="neo-heading text-4xl mb-2"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            ADMINISTRADOR DE PRODUCTOS
                        </h1>
                        <p className="text-muted-foreground">
                            Administra tu stock de productos
                        </p>
                    </div>
                    {usuario?.rol === "admin" && (
                        <Link href="/admin/productos/agregar">
                            <Button
                                className="neo-button font-bold w-full min-h-16"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                AGREGAR NUEVO PRODUCTO
                            </Button>
                        </Link>
                    )}
                </div>

                {error && (
                    <div className="neo-card p-4 bg-destructive/10 border-destructive">
                        <p className="text-destructive">
                            Error: {errorMessage}
                        </p>
                    </div>
                )}

                <div className="">
                    <InputBusqueda
                        filteredProducts={filteredProducts}
                        query={query}
                        productos={productos}
                        handleInputChange={(e) => setQuery(e.target.value)}
                        isPending={isLoading}
                        showLength={true}
                    />

                    <div className="space-y-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((producto) => (
                                <ProductCardStock
                                    key={producto.id}
                                    producto={producto}
                                    onDelete={setDeleteProducto}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3
                                    className="neo-heading text-lg mb-2"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    NO SE ENCONTRARON PRODUCTOS
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {query
                                        ? "Ningún producto coincide con la búsqueda"
                                        : "No hay producto en stock."}
                                </p>
                                <Link href="/admin/productos/agregar">
                                    <Button
                                        className="neo-button font-bold"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        AGREGAR PRODUCTO
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ProductDeleteDialog
                producto={deleteProducto}
                onClose={() => setDeleteProducto(null)}
            />
        </div>
    );
}
