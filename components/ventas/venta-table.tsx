"use client";

import { useState } from "react";
import { VentaDetalleModal } from "./venta-detalle-modal";
import { Eye, Loader2, CheckCheckIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";

export function VentasTable() {
    const { usuario } = useAuthStore();
    const [selectedVenta, setSelectedVenta] = useState<VentaType | null>(null);
    const [rango, setRango] = useState<string>("10");
    const [desde, setDesde] = useState<string>("");
    const [hasta, setHasta] = useState<string>("");
    const [filtro, setFiltro] = useState<{
        limit?: number;
        desde?: string;
        hasta?: string;
    }>({
        limit: 10,
    });

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useListarVentas(filtro);

    const ventas = data?.pages.flatMap((page) => page.ventas) ?? [];

    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const aplicarFiltro = () => {
        switch (rango) {
            case "10":
                setFiltro({
                    limit: 10,
                });
                break;
                case "today": {
                const hoy = new Date();
                const desde = new Date(hoy.setHours(0, 0, 0, 0)).toISOString()
                const hasta = new Date(hoy).toISOString()
                setFiltro({
                    desde: desde,
                    hasta: hasta,
                });
                break;
            }
            case "7": {
                const hoy = new Date();
                const desdeFecha = new Date();
                desdeFecha.setDate(hoy.getDate() - 7);
                setFiltro({
                    desde: desdeFecha.toISOString().split("T")[0],
                    hasta: hoy.toISOString().split("T")[0],
                });
                break;
            }
            case "30": {
                const hoy = new Date();
                const desdeFecha = new Date();
                desdeFecha.setDate(hoy.getDate() - 30);
                setFiltro({
                    desde: desdeFecha.toISOString().split("T")[0],
                    hasta: hoy.toISOString().split("T")[0],
                });
                break;
            }
            case "month": {
                const hoy = new Date();
                const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                setFiltro({
                    desde: inicio.toISOString().split("T")[0],
                    hasta: hoy.toISOString().split("T")[0],
                });
                break;
            }
            case "custom":
                setFiltro({
                    desde,
                    hasta,
                });
                break;
        }
    };

    const isAdmin = usuario?.rol === "admin";

    if (error) {
        return (
            <div className="neo-card p-6 text-center">
                <p className="text-red-500 font-semibold">
                    Ocurrió un error al cargar las ventas.
                </p>
            </div>
        );
    }
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

    return (
        <>
            <div className="neo-card p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div>
                        <Label>Periodo</Label>
                        <Select value={rango} onValueChange={setRango}>
                            <SelectTrigger className="w-56 border-2-black">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">
                                    Últimas 10 ventas
                                </SelectItem>
                                <SelectItem value="today">Hoy</SelectItem>
                                <SelectItem value="7">
                                    Últimos 7 días
                                </SelectItem>
                                <SelectItem value="30">
                                    Últimos 30 días
                                </SelectItem>
                                <SelectItem value="month">Este mes</SelectItem>
                                <SelectItem value="custom">
                                    Personalizado
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {rango === "custom" && (
                        <>
                            <div>
                                <Label className="text-sm font-semibold">
                                    Desde
                                </Label>

                                <Input
                                    type="date"
                                    className="border rounded px-3 py-2"
                                    value={desde}
                                    onChange={(e) => setDesde(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold">
                                    Hasta
                                </Label>

                                <Input
                                    type="date"
                                    className="border rounded px-3 py-2"
                                    value={hasta}
                                    onChange={(e) => setHasta(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    <Button className="neo-button bg-black text-white font-black" onClick={aplicarFiltro}>
                        Buscar
                    </Button>
                </div>
            </div>
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
                                colSpan={5}
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
                                <TableCell className="text-center flex justify-center items-center gap-4 w-fit m-auto">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-10 w-fit p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                        onClick={() => setSelectedVenta(venta)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver
                                    </Button>
                                    <ConfirmaEliminarVenta venta={venta} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center font-bold">
                                        {venta.estado === "cancelada" ? (
                                            <XCircleIcon className="w-8 h-8 text-red-500" />
                                        ) : venta.estado === "completada" ? (
                                            <CheckCheckIcon className="w-8 h-8 text-green-700 rounded-full border-2 border-green-500" />
                                        ) : (
                                            "PRESUPUESTO"
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-8">
                {hasNextPage ? (
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="neo-button min-w-52 bg-black text-white font-black"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            "Cargar 10 ventas más"
                        )}
                    </Button>
                ) : (
                    ventas.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            No hay más ventas para mostrar.
                        </p>
                    )
                )}
            </div>
            <VentaDetalleModal
                venta={selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </>
    );
}
