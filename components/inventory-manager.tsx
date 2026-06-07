"use client";
import React, {
    useState,
    useEffect,
    useDeferredValue,
    useTransition,
} from "react";
import { useProductosStore } from "@/lib/stores/products-store";
import { Button } from "@/components/ui/button";
import { ProductDeleteDialog } from "@/components/producto/product-delete-dialog";
import { Plus, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductCardStock } from "./producto/product-card-stock";
import { InputBusqueda } from "./input-busqueda";
import { useShallow } from "zustand/react/shallow";
import { ProductoType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";

export function InventoryManager() {
    const { productos, isLoading, error, listarProductos } = useProductosStore(
        useShallow((state) => ({
            productos: state.productos,
            isLoading: state.isLoading,
            error: state.error,
            listarProductos: state.listarProductos,
        })),
    );
    const { usuario } = useAuthStore();

    // const [searchTerm, setSearchTerm] = useState("");
    const [query, setQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const deferredQuery = useDeferredValue(query);
    
    const [deleteProductId, setDeleteProductId] = useState<
        ProductoType["id"] | null
    >(null);

    useEffect(() => {
        listarProductos();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            setQuery(e.target.value);
        });
    };

    const filteredProducts = productos?.filter((producto) =>
        producto.nombre.toLowerCase().includes(deferredQuery.toLowerCase()),
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="text-muted-foreground">
                                Cargando inventario...
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-4 py-8">
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
                            <p className="text-destructive">Error: {error}</p>
                        </div>
                    )}

                    <div className="">
                        <InputBusqueda
                            filteredProducts={filteredProducts}
                            query={query}
                            productos={productos}
                            handleInputChange={handleInputChange}
                            isPending={isPending}
                            showLength={true}
                        />

                        <div className="space-y-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((producto) => (
                                    <ProductCardStock
                                        key={producto.id}
                                        producto={producto}
                                        onDelete={setDeleteProductId}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3
                                        className="neo-heading text-lg mb-2"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        NO SE ENCONTRARON PRODUCTOS
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {deferredQuery
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
            </main>

            <ProductDeleteDialog
                productId={deleteProductId}
                onClose={() => setDeleteProductId(null)}
            />
        </div>
    );
}
