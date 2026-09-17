import { ProductoType } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const TablaProductosVenta = ({
    productos,
    agregarItemCarrito,
}: {
    productos: ProductoType[];
    agregarItemCarrito: (item: ProductoType) => void;
}) => {
    return (
        <div className="neo-card overflow-auto h-[calc(100vh-250px)] relative">
            <Table
                className="px-4 py-3 bg-primary text-primary uppercase w-full min-w-175"
                style={{
                    fontFamily: "var(--font-montserrat)",
                }}
            >
                <TableHeader className="sticky top-0 shadow-sm z-10">
                    <TableRow>
                        <TableHead className="text-white font-bold border-e-2">
                            Acciones
                        </TableHead>
                        <TableHead className="text-white font-bold border-e-2">
                            Producto
                        </TableHead>
                        <TableHead className="text-white font-bold border-e-2">
                            Precio Un. Mayorista
                        </TableHead>
                        <TableHead className="text-white font-bold border-e-2">
                            Precio Un. Minorista
                        </TableHead>
                        <TableHead className="text-white font-bold">
                            Stock
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.map((producto) => (
                        <TableRow
                            key={producto.id}
                            className="text-sm text-black font-semibold bg-secondary cursor-default"
                        >
                            <TableCell className="text-center border-e-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="neo-button h-8 w-8 p-0 bg-sky-400 border-sky-400 cursor-pointer"
                                    onClick={() => {
                                        producto.stock > 0
                                            ? agregarItemCarrito(producto)
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
                            <TableCell className="text-center border-e-2">
                                ${producto?.precio_venta_mayorista.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center border-e-2">
                                ${producto?.precio_venta_minorista.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-end lowercase">
                                {producto?.stock}u.
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
