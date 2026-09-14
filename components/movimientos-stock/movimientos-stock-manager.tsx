"use client";

import { useState } from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Loader2,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { InconsistenciaStock } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useMovimientosStock } from "@/hooks/useMovmientosStock";
import { MovimientoStockType } from "@/lib/types";
import { useBusquedaProductos } from "@/hooks/useBusquedaProducto";
import { useResumenMovimientosStock } from "@/hooks/useResumenMovimientoStock";
import { useValidarMovimientosStock } from "@/hooks/useValidarMovimientoStock";
import {
    iniciarAuditoriaStock,
    corregirStock,
} from "@/services/movimientos-stock.services";
import { useQueryClient } from "@tanstack/react-query";
import { useAuditoriaStock } from "@/hooks/useAuditoriaStock";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ModalCorreccionStock } from "./validacion/modal-correccion-stock";

type TipoFiltro = "" | "venta" | "cancelacion_venta" | "ajuste" | "compra";

export function MovimientosStockManager() {
    const [tipo, setTipo] = useState<TipoFiltro>("");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const hoy = new Date().toISOString().split("T")[0];
    const [reporteDesde, setReporteDesde] = useState(hoy);
    const [reporteHasta, setReporteHasta] = useState(hoy);
    const [productoId, setProductoId] = useState("");
    const [tipoValidacion, setTipoValidacion] = useState<
        "todo" | "producto" | null
    >(null);
    const [productoAcorregir, setProductoAcorregir] =
        useState<InconsistenciaStock | null>(null);
    const [stockCorrecto, setStockCorrecto] = useState("");
    const [motivoCorreccion, setMotivoCorreccion] = useState("");
    // const [isCorrigiendoStock, setIsCorrigiendoStock] = useState(false);
    const [errorCorreccion, setErrorCorreccion] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const {
        data: resumenData,
        isLoading: isLoadingResumen,
        isError: isErrorResumen,
        error: errorResumen,
    } = useResumenMovimientosStock({
        desde: reporteDesde,
        hasta: reporteHasta,
    });

    const {
        data: validacionData,
        isFetching: isValidandoStock,
        isError: isErrorValidacion,
        error: errorValidacion,
        refetch: validarStock,
    } = useValidarMovimientosStock();

    const {
        data: validacionProductoData,
        isFetching: isValidandoProducto,
        isError: isErrorValidacionProducto,
        error: errorValidacionProducto,
        refetch: validarProductoStock,
    } = useValidarMovimientosStock(productoId || undefined);

    const {
        query: productoQuery,
        setQuery: setProductoQuery,
        filteredProducts,
    } = useBusquedaProductos();

    const productoSeleccionado = filteredProducts.find(
        (producto) => producto.id === productoId,
    );

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMovimientosStock({
        limit: 20,
        productoId: productoId || undefined,
        tipo: tipo || undefined,
        desde: desde || undefined,
        hasta: hasta || undefined,
    });

    const movimientos: MovimientoStockType[] =
        data?.pages.flatMap((page) => page.movimientos) ?? [];

    const {
        data: auditoriaData,
        isLoading: isLoadingAuditoria,
        refetch: refetchAuditoria,
    } = useAuditoriaStock();

    const resumen = movimientos.reduce(
        (acc, movimiento) => {
            switch (movimiento.tipo) {
                case "venta":
                    acc.ventas += Math.abs(movimiento.cantidad);
                    break;

                case "cancelacion_venta":
                    acc.cancelaciones += Math.abs(movimiento.cantidad);
                    break;

                case "compra":
                    acc.compras += Math.abs(movimiento.cantidad);
                    break;

                case "ajuste":
                    acc.ajustes += movimiento.cantidad;
                    break;
            }

            acc.neto += movimiento.cantidad;

            return acc;
        },
        {
            ventas: 0,
            cancelaciones: 0,
            compras: 0,
            ajustes: 0,
            neto: 0,
        },
    );

    const resumenPorUsuario = movimientos.reduce<
        Record<
            string,
            {
                nombre: string;
                ventas: Set<string>;
                unidades: number;
            }
        >
    >((acc, movimiento) => {
        if (movimiento.tipo !== "venta") {
            return acc;
        }
        const usuarioId = movimiento.usuarioId ?? "sin-usuario";
        if (!acc[usuarioId]) {
            acc[usuarioId] = {
                nombre: movimiento.usuarioNombre ?? "Usuario desconocido",
                ventas: new Set<string>(),
                unidades: 0,
            };
        }
        acc[usuarioId].unidades += Math.abs(movimiento.cantidad);

        if (movimiento.ventaId) {
            acc[usuarioId].ventas.add(movimiento.ventaId);
        }
        return acc;
    }, {});

    const vendedores = Object.values(resumenPorUsuario).map((usuario) => ({
        nombre: usuario.nombre,
        ventas: usuario.ventas.size,
        unidades: usuario.unidades,
    }));

    const formatearFecha = (fecha: string | Date) => {
        return new Date(fecha).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const obtenerTipoLabel = (tipo: string) => {
        switch (tipo) {
            case "venta":
                return "Venta";
            case "cancelacion_venta":
                return "Cancelación";
            case "compra":
                return "Compra";
            case "ajuste":
                return "Ajuste";
            default:
                return tipo;
        }
    };

    // const handleCorregirStock = async () => {
    //     if (!productoAcorregir) {
    //         return;
    //     }

    //     const stock = Number(stockCorrecto);

    //     if (!Number.isFinite(stock) || stock < 0) {
    //         setErrorCorreccion("Ingresá un stock válido mayor o igual a 0.");
    //         return;
    //     }

    //     if (!motivoCorreccion.trim()) {
    //         setErrorCorreccion("Ingresá el motivo de la corrección.");
    //         return;
    //     }

    //     try {
    //         setIsCorrigiendoStock(true);
    //         setErrorCorreccion(null);

    //         await corregirStock({
    //             productoId: productoAcorregir.productoId,
    //             stockCorrecto: stock,
    //             motivo: motivoCorreccion.trim(),
    //         });

    //         setProductoAcorregir(null);
    //         setStockCorrecto("");
    //         setMotivoCorreccion("");

    //         if (tipoValidacion === "todo") {
    //             await validarStock();
    //         }

    //         if (tipoValidacion === "producto") {
    //             await validarProductoStock();
    //         }
    //     } catch (error) {
    //         setErrorCorreccion(
    //             error instanceof Error
    //                 ? error.message
    //                 : "Error al corregir stock",
    //         );
    //     } finally {
    //         setIsCorrigiendoStock(false);
    //     }
    // };

    const limpiarFiltros = () => {
        setTipo("");
        setDesde("");
        setHasta("");
        setProductoId("");
        setProductoQuery("");
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="neo-button font-semibold bg-transparent"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            VOLVER AL DASHBOARD
                        </Button>
                    </Link>

                    <div className="md:text-right">
                        <h1
                            className="neo-heading text-3xl md:text-4xl"
                            style={{
                                fontFamily: "var(--font-montserrat)",
                            }}
                        >
                            MOVIMIENTOS DE STOCK
                        </h1>

                        <p className="text-muted-foreground">
                            Historial y auditoría de movimientos de inventario
                        </p>
                    </div>
                </div>

                {/* Resumen / Reporte */}
                <div className="neo-card p-3 sm:p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="neo-heading text-base sm:text-lg">
                                REPORTE DEL PERÍODO
                            </h2>

                            <p className="mt-1 text-xs text-gray-600">
                                Resumen de movimientos y ventas por vendedor.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">
                                    DESDE
                                </Label>

                                <Input
                                    type="date"
                                    value={reporteDesde}
                                    onChange={(e) =>
                                        setReporteDesde(e.target.value)
                                    }
                                    className="neo-input w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-semibold">
                                    HASTA
                                </Label>

                                <Input
                                    type="date"
                                    value={reporteHasta}
                                    onChange={(e) =>
                                        setReporteHasta(e.target.value)
                                    }
                                    className="neo-input w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {isLoadingResumen ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : isErrorResumen ? (
                        <div className="border-2 border-black p-3 text-sm">
                            {errorResumen instanceof Error
                                ? errorResumen.message
                                : "Error al obtener el resumen"}
                        </div>
                    ) : resumenData ? (
                        <>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <div className="border-2 border-black p-2 sm:p-3">
                                    <p className="text-xs font-semibold text-gray-600">
                                        VENTAS
                                    </p>

                                    <p className="text-xl font-bold">
                                        {resumenData.resumen.ventas}
                                    </p>
                                </div>

                                <div className="border-2 border-black p-2 sm:p-3">
                                    <p className="text-xs font-semibold text-gray-600">
                                        UNIDADES VENDIDAS
                                    </p>

                                    <p className="text-xl font-bold">
                                        {resumenData.resumen.unidadesVendidas}
                                    </p>
                                </div>

                                <div className="border-2 border-black p-2 sm:p-3">
                                    <p className="text-xs font-semibold text-gray-600">
                                        CANCELACIONES
                                    </p>

                                    <p className="text-xl font-bold">
                                        {resumenData.resumen.cancelaciones}
                                    </p>
                                </div>

                                <div className="border-2 border-black p-2 sm:p-3">
                                    <p className="text-xs font-semibold text-gray-600">
                                        AJUSTES
                                    </p>

                                    <p className="text-xl font-bold">
                                        {resumenData.resumen.ajustes}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="mb-2 text-sm font-bold">
                                    VENTAS POR VENDEDOR
                                </h3>

                                {resumenData.vendedores.length === 0 ? (
                                    <div className="border-2 border-black p-3 text-sm">
                                        No hay ventas en este período.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                        {resumenData.vendedores.map(
                                            (vendedor) => (
                                                <div
                                                    key={vendedor.usuarioId}
                                                    className="flex flex-col items-end justify-between border-2 border-black p-1"
                                                >
                                                    <p className="min-w-0 truncate font-semibold">
                                                        {vendedor.nombre}
                                                    </p>

                                                    <div className="shrink-0 text-right text-sm">
                                                        <p>
                                                            {vendedor.ventas}{" "}
                                                            {vendedor.ventas ===
                                                            1
                                                                ? "venta"
                                                                : "ventas"}
                                                        </p>

                                                        <p className="font-bold">
                                                            {
                                                                vendedor.unidadesVendidas
                                                            }{" "}
                                                            {vendedor.unidadesVendidas ===
                                                            1
                                                                ? "unidad"
                                                                : "unidades"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 border-2 border-black p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-semibold">
                                        MOVIMIENTO NETO
                                    </span>

                                    <span className="text-lg font-bold">
                                        {resumenData.resumen.movimientoNeto > 0
                                            ? "+"
                                            : ""}
                                        {resumenData.resumen.movimientoNeto}{" "}
                                        unidades
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {/*AUDITORIA*/}

                {!isLoadingAuditoria &&
                    auditoriaData &&
                    !auditoriaData.auditoriaIniciada && (
                        <div className="neo-card p-3 sm:p-4">
                            <h2 className="neo-heading text-base sm:text-lg">
                                AUDITORÍA DE STOCK
                            </h2>

                            <p className="mt-2 text-sm">
                                La auditoría comenzará a partir de este momento.
                                Los movimientos anteriores no serán utilizados
                                para detectar inconsistencias.
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                                Esta acción no modifica ningún stock ni ningún
                                movimiento existente.
                            </p>

                            <Button
                                variant="outline"
                                type="button"
                                onClick={async () => {
                                    try {
                                        await iniciarAuditoriaStock();

                                        await queryClient.invalidateQueries({
                                            queryKey: [
                                                "configuracionAuditoriaStock",
                                            ],
                                        });

                                        await refetchAuditoria();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                                className="neo-button mt-4 w-full sm:w-auto"
                            >
                                INICIAR AUDITORÍA
                            </Button>
                        </div>
                    )}

                {!isLoadingAuditoria &&
                    auditoriaData?.auditoriaIniciada &&
                    auditoriaData.inicioAuditoria && (
                        <div className="mb-3 text-xs text-gray-500 font-semibold text-end">
                            Auditoría iniciada el{" "}
                            {new Date(
                                auditoriaData.inicioAuditoria,
                            ).toLocaleString("es-AR")}
                        </div>
                    )}
                {!isLoadingAuditoria && auditoriaData?.ultimaValidacion && (
                    <div className="neo-card mb-4 p-3 sm:p-4">
                        <h2 className="neo-heading text-base sm:text-lg">
                            ÚLTIMA VALIDACIÓN
                        </h2>

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div className="border-2 border-black p-2">
                                <p className="text-xs font-semibold text-gray-600">
                                    TIPO
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                    {auditoriaData.ultimaValidacion.tipo ===
                                    "todo"
                                        ? "TODO EL STOCK"
                                        : "PRODUCTO"}
                                </p>
                            </div>

                            <div className="border-2 border-black p-2">
                                <p className="text-xs font-semibold text-gray-600">
                                    RESULTADO
                                </p>

                                <p
                                    className={`mt-1 text-sm font-bold ${
                                        auditoriaData.ultimaValidacion
                                            .consistente
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {auditoriaData.ultimaValidacion.consistente
                                        ? "CONSISTENTE"
                                        : "CON INCONSISTENCIAS"}
                                </p>
                            </div>

                            <div className="border-2 border-black p-2">
                                <p className="text-xs font-semibold text-gray-600">
                                    INCONSISTENCIAS
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {
                                        auditoriaData.ultimaValidacion
                                            .inconsistencias
                                    }
                                </p>
                            </div>

                            <div className="border-2 border-black p-2">
                                <p className="text-xs font-semibold text-gray-600">
                                    MOVIMIENTOS
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {
                                        auditoriaData.ultimaValidacion
                                            .movimientosRevisados
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                            {auditoriaData.ultimaValidacion.fecha && (
                                <p>
                                    Validado el{" "}
                                    {new Date(
                                        auditoriaData.ultimaValidacion.fecha,
                                    ).toLocaleString("es-AR")}
                                </p>
                            )}

                            <p>
                                Productos revisados:{" "}
                                {
                                    auditoriaData.ultimaValidacion
                                        .productosRevisados
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/*Validacion*/}
                <div className="neo-card p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="neo-heading text-base sm:text-lg">
                                AUDITORÍA DE STOCK
                            </h2>

                            <p className="mt-1 text-xs text-gray-600">
                                Comprueba la consistencia de los movimientos y
                                del stock actual.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={async () => {
                                    setTipoValidacion("todo");
                                    await validarStock();
                                    await queryClient.invalidateQueries({
                                        queryKey: [
                                            "configuracionAuditoriaStock",
                                        ],
                                    });
                                }}
                                disabled={
                                    isValidandoStock || isValidandoProducto
                                }
                                className="neo-button w-full sm:w-auto border-accent-foreground"
                            >
                                {isValidandoStock &&
                                tipoValidacion === "todo" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        VALIDANDO...
                                    </>
                                ) : (
                                    "AUDITAR STOCK"
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                type="button"
                                onClick={async () => {
                                    setTipoValidacion("producto");
                                    await validarProductoStock();
                                    await queryClient.invalidateQueries({
                                        queryKey: [
                                            "configuracionAuditoriaStock",
                                        ],
                                    });
                                }}
                                disabled={
                                    !productoId ||
                                    isValidandoStock ||
                                    isValidandoProducto
                                }
                                className="neo-button w-full sm:w-auto bg-black text-white"
                            >
                                {isValidandoProducto &&
                                tipoValidacion === "producto" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        VALIDANDO...
                                    </>
                                ) : (
                                    "AUDITAR PRODUCTO"
                                )}
                            </Button>
                        </div>
                    </div>

                    {tipoValidacion === "todo" && isErrorValidacion && (
                        <div className="mt-4 border-2 border-black p-3 text-sm bg-red-300 font-semibold">
                            {errorValidacion instanceof Error
                                ? errorValidacion.message
                                : "Error al validar el stock"}
                        </div>
                    )}

                    {tipoValidacion === "todo" && validacionData && (
                        <div className="mt-4">
                            {validacionData.consistente ? (
                                <div className="border-2 border-black bg-gray-100 p-4">
                                    <p className="font-bold">
                                        STOCK CONSISTENTE
                                    </p>

                                    <p className="mt-1 text-sm">
                                        No se encontraron inconsistencias en los
                                        movimientos registrados.
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-black p-4">
                                    <p className="font-bold">
                                        SE ENCONTRARON INCONSISTENCIAS
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Se encontraron{" "}
                                        <strong>
                                            {
                                                validacionData.inconsistencias
                                                    .length
                                            }
                                        </strong>{" "}
                                        inconsistencias en el historial.
                                    </p>
                                </div>
                            )}

                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                <div className="border-2 border-black p-2">
                                    <p className="text-xs font-semibold text-gray-600">
                                        PRODUCTOS
                                    </p>

                                    <p className="text-lg font-bold">
                                        {validacionData.productosRevisados}
                                    </p>
                                </div>

                                <div className="border-2 border-black p-2">
                                    <p className="text-xs font-semibold text-gray-600">
                                        MOVIMIENTOS
                                    </p>

                                    <p className="text-lg font-bold">
                                        {validacionData.movimientosRevisados}
                                    </p>
                                </div>

                                <div className="col-span-2 border-2 border-black p-2 sm:col-span-1">
                                    <p className="text-xs font-semibold text-gray-600">
                                        INCONSISTENCIAS
                                    </p>

                                    <p className="text-lg font-bold">
                                        {validacionData.inconsistencias.length}
                                    </p>
                                </div>
                            </div>

                            {validacionData.inconsistencias.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="mb-2 text-sm font-bold">
                                        DETALLE
                                    </h3>

                                    <div className="space-y-2">
                                        {validacionData.inconsistencias.map(
                                            (inconsistencia, index) => (
                                                <div
                                                    key={`${inconsistencia.movimientoId ?? "sin-id"}-${index}`}
                                                    className="border-2 border-black p-3"
                                                >
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                        <p className="min-w-0 font-bold">
                                                            {
                                                                inconsistencia.productoNombre
                                                            }
                                                        </p>

                                                        {/* <span className="shrink-0 text-xs font-bold uppercase">
                                                            {inconsistencia.tipo.replace(
                                                                /_/g,
                                                                " ",
                                                            )}
                                                        </span> */}
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-bold">
                                                                {inconsistencia.tipo ===
                                                                "stock_actual_incorrecto"
                                                                    ? "STOCK ACTUAL INCORRECTO"
                                                                    : inconsistencia.tipo ===
                                                                        "ruptura_continuidad"
                                                                      ? "RUPTURA DE CONTINUIDAD"
                                                                      : "CANTIDAD INCORRECTA"}
                                                            </span>

                                                            {inconsistencia.tipo ===
                                                            "stock_actual_incorrecto" ? (
                                                                <span className="border-2 border-black bg-yellow-200 px-2 py-1 text-xs font-bold">
                                                                    CORREGIBLE
                                                                </span>
                                                            ) : (
                                                                <span className="border-2 border-black bg-gray-200 px-2 py-1 text-xs font-bold">
                                                                    REQUIERE
                                                                    REVISIÓN
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="mt-2 text-sm">
                                                        {inconsistencia.detalle}
                                                    </p>

                                                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                                                        {inconsistencia.fechaMovimiento && (
                                                            <p>
                                                                Fecha:{" "}
                                                                {new Date(
                                                                    inconsistencia.fechaMovimiento,
                                                                ).toLocaleString(
                                                                    "es-AR",
                                                                )}
                                                            </p>
                                                        )}

                                                        {inconsistencia.movimientoAnterior && (
                                                            <p>
                                                                Movimiento
                                                                anterior:{" "}
                                                                <span className="break-all">
                                                                    {
                                                                        inconsistencia
                                                                            .movimientoAnterior
                                                                            .id
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}

                                                        {inconsistencia.movimientoId && (
                                                            <p>
                                                                Movimiento
                                                                actual:{" "}
                                                                <span className="break-all">
                                                                    {
                                                                        inconsistencia.movimientoId
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    {inconsistencia.tipo ===
                                                        "stock_actual_incorrecto" && (
                                                        <Button
                                                            variant={"outline"}
                                                            type="button"
                                                            onClick={() => {
                                                                setProductoAcorregir(
                                                                    inconsistencia,
                                                                );
                                                                setStockCorrecto(
                                                                    String(
                                                                        inconsistencia.stockUltimoMovimiento ??
                                                                            "",
                                                                    ),
                                                                );
                                                                setMotivoCorreccion(
                                                                    "",
                                                                );
                                                                setErrorCorreccion(
                                                                    null,
                                                                );
                                                            }}
                                                            className="neo-button mt-4 w-full sm:w-auto bg-black text-white font-semibold"
                                                        >
                                                            CORREGIR STOCK
                                                        </Button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {tipoValidacion === "producto" &&
                        validacionProductoData && (
                            <div className="mt-4 border-2 border-black p-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">
                                            VALIDACIÓN INDIVIDUAL
                                        </p>

                                        <p className="font-bold">
                                            {productoSeleccionado?.nombre ??
                                                "Producto seleccionado"}
                                        </p>
                                    </div>

                                    <span className="text-sm font-bold">
                                        {validacionProductoData.consistente
                                            ? "CONSISTENTE"
                                            : "CON INCONSISTENCIAS"}
                                    </span>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="border-2 border-black p-2">
                                        <p className="text-xs font-semibold text-gray-600">
                                            MOVIMIENTOS
                                        </p>

                                        <p className="text-lg font-bold">
                                            {
                                                validacionProductoData.movimientosRevisados
                                            }
                                        </p>
                                    </div>

                                    <div className="border-2 border-black p-2">
                                        <p className="text-xs font-semibold text-gray-600">
                                            INCONSISTENCIAS
                                        </p>

                                        <p className="text-lg font-bold">
                                            {
                                                validacionProductoData
                                                    .inconsistencias.length
                                            }
                                        </p>
                                    </div>
                                </div>

                                {validacionProductoData.inconsistencias.length >
                                    0 && (
                                    <div className="mt-4 space-y-2">
                                        {validacionProductoData.inconsistencias.map(
                                            (inconsistencia, index) => (
                                                <div
                                                    key={`${inconsistencia.movimientoId ?? "sin-id"}-${index}`}
                                                    className="border-2 border-black p-3"
                                                >
                                                    {/* <p className="font-bold uppercase">
                                                        {inconsistencia.tipo.replace(
                                                            /_/g,
                                                            " ",
                                                        )}
                                                    </p> */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold">
                                                            {inconsistencia.tipo ===
                                                            "stock_actual_incorrecto"
                                                                ? "STOCK ACTUAL INCORRECTO"
                                                                : inconsistencia.tipo ===
                                                                    "ruptura_continuidad"
                                                                  ? "RUPTURA DE CONTINUIDAD"
                                                                  : "CANTIDAD INCORRECTA"}
                                                        </span>

                                                        {inconsistencia.tipo ===
                                                        "stock_actual_incorrecto" ? (
                                                            <span className="border-2 border-black bg-yellow-200 px-2 py-1 text-xs font-bold">
                                                                CORREGIBLE
                                                            </span>
                                                        ) : (
                                                            <span className="border-2 border-black bg-gray-200 px-2 py-1 text-xs font-bold">
                                                                REQUIERE
                                                                REVISIÓN
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm">
                                                        {inconsistencia.detalle}
                                                    </p>
                                                    {inconsistencia.tipo ===
                                                        "cantidad_incorrecta" && (
                                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                                            <div className="border-2 border-black p-2">
                                                                <p className="text-xs font-semibold text-gray-600">
                                                                    STOCK
                                                                    ANTERIOR
                                                                </p>

                                                                <p className="text-xl font-bold">
                                                                    {
                                                                        inconsistencia.stockAnteriorRegistrado
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="border-2 border-black p-2">
                                                                <p className="text-xs font-semibold text-gray-600">
                                                                    CANTIDAD
                                                                </p>

                                                                <p className="text-xl font-bold">
                                                                    {
                                                                        inconsistencia.cantidadRegistrada
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="border-2 border-black p-2">
                                                                <p className="text-xs font-semibold text-gray-600">
                                                                    STOCK NUEVO
                                                                </p>

                                                                <p className="text-xl font-bold">
                                                                    {
                                                                        inconsistencia.stockNuevoRegistrado
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {inconsistencia.tipo ===
                                                        "ruptura_continuidad" &&
                                                        inconsistencia.movimientoAnterior &&
                                                        inconsistencia.stockAnteriorRegistrado !==
                                                            undefined && (
                                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                                <div className="border-2 border-black p-2">
                                                                    <p className="text-xs font-semibold text-gray-600">
                                                                        STOCK
                                                                        ANTERIOR
                                                                    </p>

                                                                    <p className="text-xl font-bold">
                                                                        {
                                                                            inconsistencia
                                                                                .movimientoAnterior
                                                                                .stockNuevo
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        Último
                                                                        stock
                                                                        registrado
                                                                    </p>
                                                                </div>

                                                                <div className="border-2 border-black p-2">
                                                                    <p className="text-xs font-semibold text-gray-600">
                                                                        STOCK
                                                                        INICIAL
                                                                    </p>

                                                                    <p className="text-xl font-bold">
                                                                        {
                                                                            inconsistencia.stockAnteriorRegistrado
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        Siguiente
                                                                        movimiento
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {inconsistencia.movimientoId && (
                                                        <p className="mt-2 break-all text-xs text-gray-500">
                                                            Movimiento:{" "}
                                                            {
                                                                inconsistencia.movimientoId
                                                            }
                                                        </p>
                                                    )}
                                                    {inconsistencia.tipo ===
                                                        "stock_actual_incorrecto" && (
                                                        <Button
                                                            variant={"outline"}
                                                            type="button"
                                                            onClick={() => {
                                                                setProductoAcorregir(
                                                                    inconsistencia,
                                                                );
                                                                setStockCorrecto(
                                                                    String(
                                                                        inconsistencia.stockUltimoMovimiento ??
                                                                            "",
                                                                    ),
                                                                );
                                                                setMotivoCorreccion(
                                                                    "",
                                                                );
                                                                setErrorCorreccion(
                                                                    null,
                                                                );
                                                            }}
                                                            className="neo-button mt-4 w-full sm:w-auto bg-black text-white font-semibold"
                                                        >
                                                            CORREGIR STOCK
                                                        </Button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    {tipoValidacion === "producto" &&
                        isErrorValidacionProducto && (
                            <div className="mt-4 border-2 border-black p-3 text-sm">
                                {errorValidacionProducto instanceof Error
                                    ? errorValidacionProducto.message
                                    : "Error al validar el producto"}
                            </div>
                        )}
                </div>

                {/* Filtros */}
                <div className="neo-card p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="relative flex flex-col gap-2 sm:col-span-4">
                            <Label className="text-sm font-semibold">
                                PRODUCTO
                            </Label>

                            <Input
                                type="text"
                                value={productoQuery}
                                onChange={(e) => {
                                    setProductoQuery(e.target.value);
                                    setProductoId("");
                                }}
                                placeholder="Buscar producto..."
                                className="neo-input w-full text-black"
                            />

                            {productoQuery && !productoId && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto border-2 border-black bg-white shadow-[4px_4px_0px_0px_black]">
                                    {filteredProducts.length === 0 ? (
                                        <div className="p-3 text-sm">
                                            No se encontraron productos.
                                        </div>
                                    ) : (
                                        filteredProducts
                                            .slice(0, 20)
                                            .map((producto) => (
                                                <Button
                                                    key={producto.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setProductoId(
                                                            producto.id,
                                                        );
                                                        setProductoQuery("");
                                                    }}
                                                    className="block w-full border-b border-gray-300 p-3 text-left text-sm hover:bg-gray-100 bg-white text-black cursor-pointer"
                                                >
                                                    {producto.nombre}
                                                </Button>
                                            ))
                                    )}
                                </div>
                            )}

                            {productoId && (
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="min-w-0 flex-1 truncate border-2 border-black bg-gray-100 px-3 py-2 text-sm font-semibold">
                                        {filteredProducts.find(
                                            (producto) =>
                                                producto.id === productoId,
                                        )?.nombre ?? "Producto seleccionado"}
                                    </span>

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setProductoId("");
                                            setProductoQuery("");
                                        }}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-white font-bold hover:bg-gray-100 text-black cursor-pointer"
                                        aria-label="Quitar producto"
                                    >
                                        ×
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div>
                            <Label className="block text-sm font-semibold mb-2">
                                TIPO
                            </Label>

                            <select
                                value={tipo}
                                onChange={(e) =>
                                    setTipo(e.target.value as TipoFiltro)
                                }
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="venta">Ventas</option>
                                <option value="cancelacion_venta">
                                    Cancelaciones
                                </option>
                                <option value="compra">Compras</option>
                                <option value="ajuste">Ajustes</option>
                            </select>
                        </div>

                        <div>
                            <Label className="block text-sm font-semibold mb-2">
                                DESDE
                            </Label>

                            <Input
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-semibold mb-2">
                                HASTA
                            </Label>

                            <Input
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <Button
                                variant="outline"
                                onClick={limpiarFiltros}
                                className="flex-1"
                            >
                                LIMPIAR
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                className="h-10 px-3"
                                title="Actualizar"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {isError && (
                    <div className="neo-card p-4 bg-destructive/10 border-destructive">
                        <p className="text-destructive font-medium">
                            {error instanceof Error
                                ? error.message
                                : "Error al obtener los movimientos"}
                        </p>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="text-muted-foreground">
                                Cargando movimientos...
                            </p>
                        </div>
                    </div>
                )}
                {/* Resumen */}
                {/* <div className="neo-card p-3 sm:p-4">
                    <h2 className="neo-heading mb-3 text-base sm:text-lg">
                        RESUMEN
                    </h2>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        <div className="border-2 border-black p-2 sm:p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                VENTAS
                            </p>
                            <p className="text-lg font-bold">
                                {resumen.ventas}
                            </p>
                        </div>

                        <div className="border-2 border-black p-2 sm:p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                CANCELACIONES
                            </p>
                            <p className="text-lg font-bold">
                                {resumen.cancelaciones}
                            </p>
                        </div>

                        <div className="border-2 border-black p-2 sm:p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                COMPRAS
                            </p>
                            <p className="text-lg font-bold">
                                {resumen.compras}
                            </p>
                        </div>

                        <div className="border-2 border-black p-2 sm:p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                AJUSTES
                            </p>
                            <p className="text-lg font-bold">
                                {resumen.ajustes}
                            </p>
                        </div>
                        <div className="border-2 border-black p-3 col-span-2 sm:col-span-1">
                            <p className="text-xs font-semibold text-gray-600">
                                MOVIMIENTO NETO
                            </p>

                            <p className="text-xl font-bold text-end">
                                {resumen.neto > 0 ? "+" : ""}
                                {resumen.neto} un.
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Vendedores */}
                {/* {vendedores.length > 0 && (
                    <div className="neo-card p-3 sm:p-4">
                        <h2 className="neo-heading mb-3 text-base sm:text-lg">
                            VENTAS POR VENDEDOR
                        </h2>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 min-h-20 max-h-20 cursor-default overflow-y-auto">
                            {vendedores.map((vendedor) => (
                                <div
                                    key={vendedor.nombre}
                                    className="flex items-center justify-between gap-3 border-2 border-black p-3 hover:bg-sky-100"
                                >
                                    <p className="min-w-0 truncate font-semibold">
                                        {vendedor.nombre}
                                    </p>

                                    <div className="shrink-0 text-right text-sm">
                                        <p>
                                            {vendedor.ventas}{" "}
                                            {vendedor.ventas === 1
                                                ? "venta"
                                                : "ventas"}
                                        </p>

                                        <p className="font-bold">
                                            {vendedor.unidades}{" "}
                                            {vendedor.unidades === 1
                                                ? "unidad"
                                                : "unidades"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Lista */}
                {!isLoading && !isError && (
                    <>
                        {movimientos.length === 0 ? (
                            <div className="neo-card p-12 text-center">
                                <p className="text-muted-foreground">
                                    No se encontraron movimientos de stock.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {movimientos.map((movimiento) => {
                                        const esEntrada =
                                            movimiento.cantidad > 0;
                                        return (
                                            <div
                                                key={movimiento.id}
                                                className="neo-card p-3 min-h-56 max-h-56"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        {movimiento.cantidad <
                                                        0 ? (
                                                            <ArrowDown className="mt-0.5 h-5 w-5 shrink-0" />
                                                        ) : (
                                                            <ArrowUp className="mt-0.5 h-5 w-5 shrink-0" />
                                                        )}

                                                        <div className="min-w-0 space-y-2">
                                                            <p className="font-bold">
                                                                {movimiento.tipo ===
                                                                "venta"
                                                                    ? "VENTA"
                                                                    : movimiento.tipo ===
                                                                        "cancelacion_venta"
                                                                      ? "CANCELACIÓN"
                                                                      : movimiento.tipo ===
                                                                          "ajuste"
                                                                        ? "AJUSTE"
                                                                        : movimiento.tipo ===
                                                                            "confirmacion_presupuesto"
                                                                          ? "CONFIRMACIÓN DE..."
                                                                          : "COMPRA"}
                                                            </p>
                                                            {movimiento.esCorreccionAuditoria && (
                                                                <p className="border-2 border-black p-1 text-xs font-bold">
                                                                    CORRECCIÓN
                                                                    DE AUDITORÍA
                                                                </p>
                                                            )}

                                                            <p className="text-xs text-gray-600">
                                                                {formatearFecha(
                                                                    movimiento.creadoEn,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 text-lg font-bold">
                                                        {movimiento.cantidad > 0
                                                            ? "+"
                                                            : ""}
                                                        {movimiento.cantidad}
                                                    </span>
                                                </div>

                                                <div className="mt-2 border-t-2 border-black pt-2">
                                                    <p className="truncate font-semibold">
                                                        {
                                                            movimiento.productoNombre
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm">
                                                        Stock:{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                movimiento.stockAnterior
                                                            }
                                                        </span>
                                                        {" → "}
                                                        <span className="font-semibold">
                                                            {
                                                                movimiento.stockNuevo
                                                            }
                                                        </span>
                                                    </p>
                                                </div>

                                                {(movimiento.usuarioNombre ||
                                                    movimiento.ventaId ||
                                                    movimiento.motivo) && (
                                                    <div className="mt-2 space-y-1 border-t border-gray-300 pt-2 text-xs text-gray-600">
                                                        {movimiento.usuarioNombre && (
                                                            <p>
                                                                Usuario:{" "}
                                                                <span className="font-semibold text-black">
                                                                    {
                                                                        movimiento.usuarioNombre
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}

                                                        {movimiento.ventaId && (
                                                            <p className="truncate">
                                                                Venta:{" "}
                                                                <span className="font-mono">
                                                                    {
                                                                        movimiento.ventaId
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}

                                                        {movimiento.motivo && (
                                                            <p>
                                                                Motivo:{" "}
                                                                {
                                                                    movimiento.motivo
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {hasNextPage && (
                                    <div className="flex justify-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="neo-button font-semibold"
                                        >
                                            {isFetchingNextPage ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    CARGANDO...
                                                </>
                                            ) : (
                                                "CARGAR MÁS"
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            {productoAcorregir && (
                <ModalCorreccionStock
                    productoAcorregir={productoAcorregir}
                    setProductoAcorregir={setProductoAcorregir}
                    tipoValidacion={tipoValidacion}
                    validarProductoStock={validarProductoStock}
                    validarStock={validarStock}
                    errorCorreccion={errorCorreccion}
                    motivoCorreccion={motivoCorreccion}
                    setErrorCorreccion={setErrorCorreccion}
                    setMotivoCorreccion={setMotivoCorreccion}
                    setStockCorrecto={setStockCorrecto}
                    stockCorrecto={stockCorrecto}
                />
                // <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3">
                //     <div className="neo-card w-full max-w-md p-4 sm:p-6">
                //         <h2 className="neo-heading text-lg">CORREGIR STOCK</h2>

                //         <p className="mt-2 text-sm">Producto:</p>

                //         <p className="font-bold">
                //             {productoAcorregir.productoNombre}
                //         </p>

                //         <div className="mt-4 border-2 border-black p-3">
                //             <p className="text-xs font-semibold text-gray-600">
                //                 STOCK ACTUAL REGISTRADO
                //             </p>

                //             <p className="text-2xl font-bold">
                //                 {productoAcorregir.stockAnteriorRegistrado}
                //             </p>
                //         </div>

                //         <div className="mt-4">
                //             <Label className="text-sm font-semibold">
                //                 STOCK CORRECTO
                //             </Label>

                //             <Input
                //                 type="number"
                //                 min="0"
                //                 value={stockCorrecto}
                //                 onChange={(e) =>
                //                     setStockCorrecto(e.target.value)
                //                 }
                //                 className="neo-input mt-1 w-full"
                //                 placeholder="Ej: 15"
                //             />
                //         </div>

                //         <div className="mt-4">
                //             <Label className="text-sm font-semibold">
                //                 MOTIVO
                //             </Label>

                //             <Textarea
                //                 value={motivoCorreccion}
                //                 onChange={(e) =>
                //                     setMotivoCorreccion(e.target.value)
                //                 }
                //                 className="neo-input mt-1 min-h-24 w-full resize-y"
                //                 placeholder="Ej: Conteo físico de stock"
                //             />
                //         </div>

                //         {errorCorreccion && (
                //             <div className="mt-3 border-2 border-black bg-red-100 p-3 text-sm">
                //                 {errorCorreccion}
                //             </div>
                //         )}

                //         <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                //             <Button
                //                 variant="outline"
                //                 type="button"
                //                 onClick={() => {
                //                     if (isCorrigiendoStock) {
                //                         return;
                //                     }

                //                     setProductoAcorregir(null);
                //                     setStockCorrecto("");
                //                     setMotivoCorreccion("");
                //                     setErrorCorreccion(null);
                //                 }}
                //                 className="neo-button w-full sm:w-auto"
                //                 disabled={isCorrigiendoStock}
                //             >
                //                 CANCELAR
                //             </Button>

                //             <Button
                //                 type="button"
                //                 variant="outline"
                //                 onClick={handleCorregirStock}
                //                 className="neo-button w-full sm:w-auto bg-black text-white font-semibold hover:bg-black/80 hover:text-white"
                //                 disabled={isCorrigiendoStock}
                //             >
                //                 {isCorrigiendoStock
                //                     ? "CORRIGIENDO..."
                //                     : "CONFIRMAR CORRECCIÓN"}
                //             </Button>
                //         </div>
                //     </div>
                // </div>
            )}
        </div>
    );
}
