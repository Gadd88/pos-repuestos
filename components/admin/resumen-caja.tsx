"use client";

import { useResumenCaja } from "@/features/ventas/useVentas";
import { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Input } from "../ui/input";

const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
    }).format(valor);
};

const obtenerFechaHoy = () => {
    const hoy = new Date();

    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
};

export default function ResumenCaja() {
    const fechaHoy = useMemo(() => obtenerFechaHoy(), []);

    const [fecha, setFecha] = useState(fechaHoy);

    const { usuario } = useAuthStore();
    const esAdmin = usuario?.rol === "admin";


    const {
        data,
        isLoading,
        isError,
        error,
    } = useResumenCaja({
        desde: fecha,
        hasta: fecha,
    });

    if (isLoading) {
        return (
            <div className="p-4">
                <p className="text-sm text-gray-500">
                    Cargando resumen de caja...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4">
                <p className="text-sm text-red-600">
                    {error instanceof Error
                        ? error.message
                        : "Error al cargar el resumen de caja"}
                </p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const {
        resumen,
        metodosPago,
        vendedores,
        controles,
    } = data;

    return (
        <div className="w-full max-w-full space-y-4 overflow-hidden p-3 sm:p-4 mt-2">
            {/* Encabezado */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold sm:text-2xl">
                        Resumen de caja
                    </h1>

                    <p className="text-sm text-gray-500">
                        Ventas del día
                    </p>
                </div>

                <Input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    // className="rounded-md border px-3 py-2 text-sm"
                    className="w-full rounded-md border px-3 py-2 text-sm sm:w-auto"
                />
            </div>

            {/* Resumen general */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Total generado
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                        {formatearMoneda(
                            resumen.totalGenerado
                        )}
                    </p>
                </div>

                {esAdmin && <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Ganancia
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                        {formatearMoneda(
                            resumen.ganancia
                        )}
                    </p>
                </div>}

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Ventas
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                        {resumen.cantidadVentas}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Unidades vendidas
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                        {resumen.unidadesVendidas}
                    </p>
                </div>
            </div>

            {/* Métodos de pago */}
            <section className="rounded-lg border">
                <div className="border-b p-4">
                    <h2 className="font-semibold">
                        Medios de pago
                    </h2>
                </div>

                <div className="divide-y text-start">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-medium">
                                Efectivo
                            </p>

                            <p className="text-sm text-gray-500">
                                {metodosPago.efectivo.cantidadVentas} ventas
                            </p>
                        </div>

                        <p className="shrink-0 font-semibold text-right">
                            {formatearMoneda(
                                metodosPago.efectivo.total
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-medium">
                                Tarjeta
                            </p>

                            <p className="text-sm text-gray-500">
                                {metodosPago.tarjeta.cantidadVentas} ventas
                            </p>
                        </div>

                        <p className="shrink-0 font-semibold text-right">
                            {formatearMoneda(
                                metodosPago.tarjeta.total
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-medium">
                                Transferencia
                            </p>

                            <p className="text-sm text-gray-500">
                                {metodosPago.transferencia.cantidadVentas} ventas
                            </p>
                        </div>

                        <p className="shrink-0 font-semibold text-right">
                            {formatearMoneda(
                                metodosPago.transferencia.total
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-medium">
                            QR
                            </p>

                            <p className="text-sm text-gray-500">
                                {metodosPago.qr.cantidadVentas} ventas
                            </p>
                        </div>

                        <p className="shrink-0 font-semibold text-right">
                            {formatearMoneda(
                                metodosPago.qr.total
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4">
                        <p className="font-semibold">
                            Total
                        </p>

                        <p className="font-bold">
                            {formatearMoneda(
                                metodosPago.total
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Vendedores */}
            <section className="rounded-lg border">
                <div className="border-b p-4">
                    <h2 className="font-semibold">
                        Ventas por vendedor
                    </h2>
                </div>

                {vendedores.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                        No hay ventas para esta fecha.
                    </p>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-162.5 w-full text-sm">
                            <TableHeader>
                                <TableRow className="border-b text-left">
                                    <TableHead className="p-4 font-semibold uppercase">
                                        Vendedor
                                    </TableHead>

                                    <TableHead className="p-4 text-right font-semibold uppercase">
                                        Ventas
                                    </TableHead>

                                    <TableHead className="p-4 text-right font-semibold uppercase">
                                        Unidades
                                    </TableHead>

                                    <TableHead className="p-4 text-right font-semibold uppercase">
                                        Total
                                    </TableHead>

                                    {esAdmin && <TableHead className="p-4 text-right font-semibold uppercase">
                                        Ganancia
                                    </TableHead>}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {vendedores.map(
                                    (vendedor) => (
                                        <TableRow
                                            key={
                                                vendedor.vendedorId
                                            }
                                            className="border-b last:border-0 text-start"
                                        >
                                            <TableCell className="p-4">
                                                {
                                                    vendedor.vendedorNombre
                                                }
                                            </TableCell>

                                            <TableCell className="p-4 text-right">
                                                {
                                                    vendedor.cantidadVentas
                                                }
                                            </TableCell>

                                            <TableCell className="p-4 text-right">
                                                {
                                                    vendedor.unidadesVendidas
                                                }
                                            </TableCell>

                                            <TableCell className="p-4 text-right font-medium">
                                                {formatearMoneda(
                                                    vendedor.totalGenerado
                                                )}
                                            </TableCell>

                                            {esAdmin && <TableCell className="p-4 text-right">
                                                {formatearMoneda(
                                                    vendedor.ganancia
                                                )}
                                            </TableCell>}
                                        </TableRow>
                                    )
                                )}
                            </TableBody>

                            <TableFooter>
                                <TableRow className="bg-gray-50 text-base sm:text-lg">
                                    <TableCell
                                        colSpan={3}
                                        className="p-4 font-semibold"
                                    >
                                        Total
                                    </TableCell>

                                    <TableCell className="p-4 text-right font-bold">
                                        {formatearMoneda(
                                            controles.totalPorVendedor
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                )}
            </section>

            {/* Controles */}
            <section className="rounded-lg border p-4">
                <h2 className="font-semibold">
                    Verificación de totales
                </h2>

                <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span>
                            Total general
                        </span>

                        <span className="font-bold">
                            {formatearMoneda(
                                resumen.totalGenerado
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>
                            Total por medios de pago
                        </span>

                        <span className="font-bold">
                            {formatearMoneda(
                                controles.totalPorMetodoPago
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>
                            Total por vendedor
                        </span>

                        <span className="font-bold">
                            {formatearMoneda(
                                controles.totalPorVendedor
                            )}
                        </span>
                    </div>

                    <div className="border-t pt-3">
                        <p
                            className={
                                controles.metodosPagoCoinciden &&
                                controles.vendedoresCoinciden
                                    ? "text-sm font-medium text-green-600"
                                    : "text-sm font-medium text-red-600"
                            }
                        >
                            {controles.metodosPagoCoinciden &&
                            controles.vendedoresCoinciden
                                ? "✓ Los totales coinciden correctamente."
                                : "⚠ Hay una diferencia entre los totales."}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}