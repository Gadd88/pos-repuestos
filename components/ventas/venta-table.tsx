"use client";

import { useState } from "react";
import { VentaDetalleModal } from "./venta-detalle-modal";
import { Eye, Loader2, CheckCheckIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VentaType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ConfirmaEliminarVenta } from "../confirma-eliminar-venta";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useListarVentas } from "@/features/ventas/useVentas";

export function VentasTable() {
    const { usuario } = useAuthStore();
    const [selectedVenta, setSelectedVenta] = useState<VentaType | null>(null);

    const { data: ventas = [], isLoading, error } = useListarVentas()
    
    const isAdmin = usuario?.rol === "admin";
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    Cargando historial de ventas...
                </p>
            </div>
        );
    }

    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            <Table
                className="neo-card px-4 py-3 uppercase"
                style={{
                    fontFamily: "var(--font-montserrat)",
                }}
            >
                <TableHeader className="bg-purple-500 border-b-2 border-black">
                    <TableRow>
                        <TableHead className="text-white font-bold border-e text-center">
                            Fecha
                        </TableHead>
                        <TableHead className="text-white font-bold text-end min-w-24">
                            Total
                        </TableHead>
                        {isAdmin && (
                            <TableHead className="text-white font-bold text-end min-w-24">
                                Ganancia
                            </TableHead>
                        )}
                        <TableHead className="text-white font-bold text-center min-w-24">
                            Acciones
                        </TableHead>
                        <TableHead className="text-white font-bold text-center">
                            Estado
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ventas.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-12 text-muted-foreground italic"
                            >
                                No se encontraron registros de ventas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        ventas?.map((venta) => (
                            <TableRow key={venta?.id}>
                                <TableCell className="w-20 border-e">
                                    {formatearFecha(venta.creadoEn)}
                                </TableCell>
                                <TableCell className="font-black text-end">
                                    ${venta?.total.toLocaleString("es-AR")}
                                </TableCell>
                                {isAdmin && (
                                    <TableCell className="font-black text-end text-green-700">
                                        $
                                        {(
                                            venta.total -
                                            (venta.totalGastado || 0)
                                        ).toLocaleString("es-AR")}
                                    </TableCell>
                                )}
                                <TableCell className="text-center flex justify-around items-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-10 w-fit p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                            onClick={() =>
                                                setSelectedVenta(venta)
                                            }
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver
                                        </Button>
                                        <ConfirmaEliminarVenta
                                            venta={venta}
                                        />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        {venta.estado === "cancelada" ? (
                                            <XCircleIcon className="w-8 h-8 text-red-500" />
                                        ) : (
                                            <CheckCheckIcon className="w-8 h-8 text-green-700 rounded-full border-2 border-green-500" />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <VentaDetalleModal
                venta={selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </>
    );
}
