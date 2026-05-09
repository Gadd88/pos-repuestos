"use client";

import { useEffect, useState } from "react";
import { VentaDetalleModal } from "./venta-detalle-modal";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVentaStore } from "@/lib/stores/ventas-store";
import { VentaType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";


export function VentasTable() {
    const { ventas, isLoading, listarVentas } = useVentaStore();
    const [selectedVenta, setSelectedVenta] = useState<VentaType | null>(
        null,
    );

    const { usuario } = useAuthStore();

    useEffect(() => {
        listarVentas();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">
                        Cargando Ventas...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="neo-card overflow-hidden">
                {/* Header de tabla */}
                <div
                    className="grid grid-cols-4 place-content-around gap-2 px-4 py-3 bg-primary text-primary-foreground border-b-2 border-border font-bold text-xs uppercase"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    <div className="text-center">Fecha</div>
                    <div className="text-center">Total Venta</div>
                    {
                        usuario?.rol === "admin" && (
                            <div className="">Ganancia</div>
                        )
                    }
                    <div className="text-end">Detalle</div>
                </div>

                {/* Filas */}
                {ventas.length === 0 ? (
                    <div className="px-4 py-12 text-center text-muted-foreground">
                        No hay ventas registradas
                    </div>
                ) : (
                    ventas.map((venta, i) => {
                        const ganancia = venta.total - venta.totalGastado;
                        const isEven = i % 2 === 0;

                        return (
                            <div
                                key={venta.id}
                                className={`grid grid-cols-12 gap-2 px-4 py-3 border-b-2 border-border items-center text-sm transition-colors hover:bg-muted/50 ${isEven ? "bg-background" : "bg-card"}`}
                            >
                                <div
                                    className="col-span-4"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    {new Date(venta.creadoEn).toLocaleDateString(
                                        "es-AR",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        },
                                    )}
                                </div>
                                <div
                                    className="col-span-4 neo-heading text-base"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    ${venta.total.toLocaleString("es-AR")}
                                </div>
                                {
                                    usuario?.rol === "admin" && (
                                        <div
                                            className={`col-span-3 font-bold text-sm ${ganancia >= 0 ? "text-green-600" : "text-destructive"}`}
                                            style={{
                                                fontFamily: "var(--font-montserrat)",
                                            }}
                                        >
                                            ${ganancia.toLocaleString("es-AR")}
                                        </div>

                                    )
                                }
                                <div className="col-span-1 flex justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="neo-button h-8 w-8 p-0"
                                        onClick={() => setSelectedVenta(venta)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <VentaDetalleModal
                venta={selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </>
    );
}
