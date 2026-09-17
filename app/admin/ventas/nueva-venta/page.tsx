"use client";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { InputBusqueda } from "@/components/input-busqueda";
import { useCarritoState } from "@/lib/stores/carrito-store";
import { Carrito } from "@/components/carrito/carrito";
import { toast } from "sonner";
import { useBusquedaProductos } from "@/hooks/useBusquedaProducto";
import Link from "next/link";
import { TablaProductosVenta } from "@/components/producto/tabla-productos-venta";

export default function NuevaVenta() {
    const { agregarItemCarrito, carrito } = useCarritoState();
    const { query, setQuery, filteredProducts, productos, isLoading, error } =
        useBusquedaProductos();

    if (isLoading) {
        return (
            <div className="container flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">
                        Cargando Productos...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="neo-button font-semibold bg-transparent"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            VOLVER AL DASHBOARD
                        </Button>
                    </Link>
                    <div className="ms-auto">
                        <h1
                            className="neo-heading text-4xl mb-2"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            NUEVA VENTA
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="lg:flex lg:gap-6 lg:w-full overflow-auto">
                        <div className="min-w-0 flex-1 my-5">
                            <InputBusqueda
                                filteredProducts={filteredProducts}
                                query={query}
                                productos={productos}
                                handleInputChange={(e) =>
                                    setQuery(e.target.value)
                                }
                                isPending={isLoading}
                            />
                            <TablaProductosVenta
                                productos={filteredProducts}
                                agregarItemCarrito={agregarItemCarrito}
                            />
                        </div>
                        <Carrito desktop />
                    </div>
                </div>
            </div>
            <Carrito />
        </>
    );
}
