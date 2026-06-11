"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VentaType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";

interface VentaDetalleModalProps {
    venta: VentaType | null;
    onClose: () => void;
}

export function VentaDetalleModal({ venta, onClose }: VentaDetalleModalProps) {
    const { usuario } = useAuthStore();

    if (!venta) return null;

    const ganancia = venta.total - venta.totalGastado;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl neo-card bg-background max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b-2 border-border bg-primary text-primary-foreground">
                    <h2
                        className="neo-heading text-xl"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        VENTA #{venta.id}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="neo-button h-8 w-8 p-0 text-primary-foreground hover:bg-primary/80"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-3 md:p-5 space-y-6">
                    {/* Info general */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                label: "TIPO ",
                                value:
                                    venta.tipo_venta === "mayorista"
                                        ? "MAYORISTA"
                                        : "MINORISTA",
                            },
                            {
                                label: "FECHA",
                                value: new Date(
                                    venta.creadoEn,
                                ).toLocaleDateString("es-AR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }),
                            },
                            {
                                label: "ITEMS",
                                value: `${venta.items.length} producto${venta.items.length !== 1 ? "s" : ""}`,
                            },
                            {
                                label: "TOTAL VENTA",
                                value: `$${venta.total.toLocaleString("es-AR")}`,
                            },
                            {
                                label: "ESTADO",
                                value: `${venta.estado?.toUpperCase() ?? "COMPLETADA"}`,
                            },
                            ...(usuario?.rol === "admin"
                                ? [
                                      {
                                          label: "GANANCIA",
                                          value: `$${ganancia.toLocaleString("es-AR")}`,
                                          highlight:
                                              ganancia >= 0 ? "green" : "red",
                                      },
                                  ]
                                : []),
                        ].map(({ label, value, highlight }) => (
                            <div
                                key={label}
                                className="neo-card p-1 md:px-4 bg-card"
                            >
                                <p
                                    className="text-xs md:text-lg font-bold text-muted-foreground mb-1"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    {label}
                                </p>
                                <p
                                    className={`neo-heading text-sm md:text-lg text-end ${highlight === "green" ? "text-green-600" : highlight === "red" ? "text-destructive" : ""}`}
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Items */}
                    <div>
                        <h3
                            className="neo-heading text-lg mb-3"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            ITEMS VENDIDOS
                        </h3>
                        <div className="neo-card overflow-hidden">
                            {/* Header */}
                            <div
                                className="grid grid-cols-12 gap-2 px-2 md:px-4 py-2 bg-muted border-b-2 border-border text-xs font-bold uppercase"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                <div className="col-span-6">Producto</div>
                                <div className="col-span-2 text-center">
                                    Cant.
                                </div>
                                <div className="col-span-4 text-right">
                                    P. Venta
                                </div>
                            </div>
                            {venta.items.map((item, i) => (
                                <div
                                    key={item.idProducto}
                                    className={`grid grid-cols-12 gap-2 px-2 md:px-4 py-3 border-b border-border text-sm items-center ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
                                >
                                    <div className="col-span-6 font-medium overflow-x-auto scrollbar-none">
                                        <p className="font-medium whitespace-nowrap">
                                            {item.nombre}
                                        </p>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="px-2 py-0.5 text-xs font-bold">
                                            x{item.cantidad}
                                        </span>
                                    </div>
                                    <div
                                        className="col-span-4 text-right font-bold"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        $
                                        {item.precio_unitario.toLocaleString(
                                            "es-AR",
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <Button
                        variant="outline"
                        className="neo-button font-bold w-full"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                        onClick={onClose}
                    >
                        CERRAR
                    </Button>
                </div>
            </div>
        </div>
    );
}
