"use client";
import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductosStore } from "@/lib/stores/products-store";
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
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";

export default function NuevaVenta() {
    const [query, setQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const deferredQuery = useDeferredValue(query);
    const { agregarItemCarrito, carrito } = useCarritoState();
    const { productos, isLoading, listarProductos } = useProductosStore();
    const { usuario } = useAuthStore();

    useEffect(() => {
        listarProductos();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            setQuery(e.target.value);
        });
    };

    const filteredProducts = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(deferredQuery.toLowerCase()),
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
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
            <main className="container mx-auto px-4 py-8 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1
                            className="neo-heading text-4xl mb-2"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            NUEVA VENTA
                        </h1>
                    </div>
                </div>
                <InputBusqueda
                    filteredProducts={filteredProducts}
                    query={query}
                    productos={productos}
                    handleInputChange={handleInputChange}
                    isPending={isPending}
                />
                <div className="neo-card overflow-auto">
                    {/* Header de tabla */}
                    <Table
                        className="px-4 py-3 bg-primary text-primary uppercase"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white font-bold border-e-2">
                                    Acciones
                                </TableHead>
                                <TableHead className="text-white font-bold border-e-2">
                                    Producto
                                </TableHead>
                                {usuario?.rol == "admin" && (
                                    <TableHead className="text-white font-bold border-e-2">
                                        Precio Un. Mayorista
                                    </TableHead>
                                )}
                                <TableHead className="text-white font-bold border-e-2">
                                    Precio Un. Minorista
                                </TableHead>
                                <TableHead className="text-white font-bold">
                                    Stock
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((producto) => (
                                <TableRow
                                    key={producto.id}
                                    className="text-sm text-black font-semibold bg-secondary-foreground"
                                >
                                    <TableCell className="text-center border-e-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="neo-button h-8 w-8 p-0 bg-sky-400 border-sky-400 cursor-pointer"
                                            onClick={() => {
                                                producto.stock > 0
                                                    ? agregarItemCarrito(
                                                          producto,
                                                      )
                                                    : toast.error(
                                                          "Producto sin stock suficiente",
                                                      );
                                            }}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="border-e-2">
                                        {producto?.nombre}
                                    </TableCell>
                                    {/* <TableCell>{producto.quantity}</TableCell> */}
                                    {usuario?.rol == "admin" && (
                                        <TableCell className="text-center border-e-2">
                                            $
                                            {producto?.precio_venta_mayorista.toFixed(
                                                2,
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell className="text-center border-e-2">
                                        $
                                        {producto?.precio_venta_minorista.toFixed(
                                            2,
                                        )}
                                    </TableCell>
                                    <TableCell className="text-end lowercase">
                                        {producto?.stock}u.
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </main>
            <Carrito />
        </>
    );

    {
        /* <VentaDetalleModal
                venta={selectedVenta}
                onClose={() => setSelectedVenta(null)}
            /> */
    }
}
