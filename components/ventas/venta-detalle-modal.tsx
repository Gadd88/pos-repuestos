// "use client";
// import { Button } from "@/components/ui/button";
// import { X, SendIcon } from "lucide-react";
// import { VentaType } from "@/lib/types";
// import { useAuthStore } from "@/lib/stores/auth-store";
// import { toast } from "sonner";
// interface VentaDetalleModalProps {
//     venta: VentaType | null;
//     onClose: () => void;
// }

// export function VentaDetalleModal({ venta, onClose }: VentaDetalleModalProps) {
//     const { usuario } = useAuthStore();

//     if (!venta) return null;

//     const ganancia = venta.total - venta.totalGastado;

//     const handleCompartirPresupuesto = async () => {
//         const link = `${window.location.origin}/presupuesto/${venta.id}`;
//         const mensaje = `🧾 Presupuesto

//         Hola! Te comparto el Presupuesto
//         Total: $${venta.total}

//         Ver detalle:
//         ${link}
//         `;
//         if (navigator.share) {
//             try {
//                 await navigator.share({
//                     title: "Presupuesto",
//                     text: `Presupusto:\n Total: $${venta.total}`,
//                     url: link
//                 });
//             } catch (error) {
//                 console.error("Error al compartir", error);
//             }
//         } else {
//             // fallback
//             window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
//         }
//     };

//     // const compartirWhatsApp = () => {
//     //     const link = `${window.location.origin}/presupuesto/${venta.id}`;
//     //     const url = `https://wa.me/?text=${encodeURIComponent(link)}`;
//     //     window.open(url, "_blank");
//     // };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
//             {/* Backdrop */}
//             <div className="absolute inset-0 bg-black/60" onClick={onClose} />

//             {/* Modal */}
//             <div className="relative z-10 w-full max-w-2xl neo-card bg-background max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div
//                     className={`flex items-center justify-between p-3 border-b-2 border-border ${venta.estado === "presupuesto" ? "bg-purple-400" : venta.estado === "completada" ? "bg-sky-400" : "bg-destructive"} text-primary-foreground`}
//                 >
//                     <h2
//                         className="neo-heading text-xl"
//                         style={{ fontFamily: "var(--font-montserrat)" }}
//                     >
//                         VENTA #{venta.id}
//                     </h2>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="neo-button h-8 w-8 p-0 text-primary-foreground hover:bg-primary/80"
//                         onClick={onClose}
//                     >
//                         <X className="w-4 h-4" />
//                     </Button>
//                 </div>

//                 <div className="p-3 md:p-5 space-y-6">
//                     {/* Info general */}
//                     <div className="grid grid-cols-2 gap-4">
//                         {[
//                             {
//                                 label: "TIPO ",
//                                 value:
//                                     venta.tipo_venta === "mayorista"
//                                         ? "MAYORISTA"
//                                         : "MINORISTA",
//                             },
//                             {
//                                 label: "FECHA",
//                                 value: new Date(
//                                     venta.creadoEn,
//                                 ).toLocaleDateString("es-AR", {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                 }),
//                             },
//                             {
//                                 label: "ITEMS",
//                                 value: `${venta.items.length} producto${venta.items.length !== 1 ? "s" : ""}`,
//                             },
//                             {
//                                 label: "TOTAL VENTA",
//                                 value: `$${venta.total.toLocaleString("es-AR")}`,
//                             },
//                             {
//                                 label: "ESTADO",
//                                 value: `${venta.estado?.toUpperCase() ?? "COMPLETADA"}`,
//                             },
//                             ...(usuario?.rol === "admin"
//                                 ? [
//                                       {
//                                           label: "GANANCIA",
//                                           value: `$${ganancia.toLocaleString("es-AR")}`,
//                                           highlight:
//                                               ganancia >= 0 ? "green" : "red",
//                                       },
//                                   ]
//                                 : []),
//                         ].map(({ label, value, highlight }) => (
//                             <div
//                                 key={label}
//                                 className="neo-card p-1 md:px-4 bg-card"
//                             >
//                                 <p
//                                     className="text-xs md:text-lg font-bold text-muted-foreground mb-1"
//                                     style={{
//                                         fontFamily: "var(--font-montserrat)",
//                                     }}
//                                 >
//                                     {label}
//                                 </p>
//                                 <p
//                                     className={`neo-heading text-sm md:text-lg text-end ${highlight === "green" ? "text-green-600" : highlight === "red" ? "text-destructive" : ""}`}
//                                     style={{
//                                         fontFamily: "var(--font-montserrat)",
//                                     }}
//                                 >
//                                     {value}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Items */}
//                     <div>
//                         <h3
//                             className="neo-heading text-lg mb-3"
//                             style={{ fontFamily: "var(--font-montserrat)" }}
//                         >
//                             ITEMS VENDIDOS
//                         </h3>
//                         <div className="neo-card overflow-hidden">
//                             {/* Header */}
//                             <div
//                                 className="grid grid-cols-12 gap-2 px-2 md:px-4 py-2 bg-muted border-b-2 border-border text-xs font-bold uppercase"
//                                 style={{ fontFamily: "var(--font-montserrat)" }}
//                             >
//                                 <div className="col-span-6">Producto</div>
//                                 <div className="col-span-2 text-center">
//                                     Cant.
//                                 </div>
//                                 <div className="col-span-4 text-right">
//                                     P. Venta
//                                 </div>
//                             </div>
//                             {venta.items.map((item, i) => (
//                                 <div
//                                     key={item.idProducto}
//                                     className={`grid grid-cols-12 gap-2 px-2 md:px-4 py-3 border-b border-border text-sm items-center ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
//                                 >
//                                     <div className="col-span-6 font-medium overflow-x-auto scrollbar-none">
//                                         <p className="font-medium whitespace-nowrap">
//                                             {item.nombre}
//                                         </p>
//                                     </div>
//                                     <div className="col-span-2 text-center">
//                                         <span className="px-2 py-0.5 text-xs font-bold">
//                                             x{item.cantidad}
//                                         </span>
//                                     </div>
//                                     <div
//                                         className="col-span-4 text-right font-bold"
//                                         style={{
//                                             fontFamily:
//                                                 "var(--font-montserrat)",
//                                         }}
//                                     >
//                                         $
//                                         {item.precio_unitario.toLocaleString(
//                                             "es-AR",
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 pb-6 space-y-4">
//                     {venta.estado === "presupuesto" && (
//                         <Button
//                             variant="ghost"
//                             className="neo-button font-bold w-full bg-green-600 text-white"
//                             style={{ fontFamily: "var(--font-montserrat)" }}
//                             onClick={() => handleCompartirPresupuesto()}
//                         >
//                             <SendIcon /> COMPARTIR PRESUPUESTO
//                         </Button>
//                     )}
//                     <Button
//                         variant="outline"
//                         className="neo-button font-bold w-full"
//                         style={{ fontFamily: "var(--font-montserrat)" }}
//                         onClick={onClose}
//                     >
//                         CERRAR
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";
import { Button } from "@/components/ui/button";
import { X, SendIcon, CheckCircle2, Loader2 } from "lucide-react";
import { VentaType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useConfirmarPresupuesto } from "@/features/presupuestos/usePresupuesto";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmaPresupuesto } from "../confirma-presupuesto";

interface VentaDetalleModalProps {
    venta: VentaType | null;
    onClose: () => void;
}

export function VentaDetalleModal({ venta, onClose }: VentaDetalleModalProps) {
    const { usuario } = useAuthStore();
    const { mutate: confirmarPresupuesto, isPending } =
        useConfirmarPresupuesto();
    const [presupuesto, setPresupuesto] = useState<VentaType | null>(null);

    if (!venta) return null;

    const ganancia = venta.total - venta.totalGastado;

    const handleCompartirPresupuesto = async () => {
        const link = `${window.location.origin}/presupuesto/${venta.id}`;
        const mensaje = `🧾 Presupuesto
        
        Hola! Te comparto el Presupuesto
        Total: $${venta.total}

        Ver detalle:
        ${link}
        `;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Presupuesto",
                    text: `Presupusto:\n Total: $${venta.total}`,
                    url: link,
                });
            } catch (error) {
                console.error("Error al compartir", error);
            }
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
        }
    };

    const handleConfirmarPresupuesto = () => {
        const confirmado = window.confirm(
            `¿Confirmar este presupuesto como venta? Se descontará stock de ${venta.items.length} producto(s).`,
        );
        if (!confirmado) return;

        confirmarPresupuesto(venta.id, {
            onSuccess: () => {
                toast.success("Presupuesto confirmado como venta");
                onClose();
            },
            onError: (error) => {
                toast.error(
                    error.message || "Error al confirmar el presupuesto",
                );
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl neo-card bg-background max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-3 border-b-2 border-border ${venta.estado === "presupuesto" ? "bg-purple-400" : venta.estado === "completada" ? "bg-sky-400" : "bg-destructive"} text-primary-foreground`}
                >
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
                <div className="px-6 pb-6 space-y-3">
                    {venta.estado === "presupuesto" && (
                        <div className="grid sm:grid-cols-2 gap-2 grid-cols-1">
                            <ConfirmaPresupuesto
                                presupuesto={venta}
                                onConfirmado={onClose}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        className="neo-button font-bold w-full bg-sky-500 text-white"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                CONFIRMANDO...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                CONFIRMAR PRESUPUESTO
                                            </>
                                        )}
                                    </Button>
                                }
                            />
                            <Button
                                variant="ghost"
                                className="neo-button font-bold w-full bg-green-600 text-white"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                                onClick={() => handleCompartirPresupuesto()}
                                disabled={isPending}
                            >
                                <SendIcon /> COMPARTIR PRESUPUESTO
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        className="neo-button font-bold w-full"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                        onClick={onClose}
                        disabled={isPending}
                    >
                        CERRAR
                    </Button>
                </div>
            </div>
        </div>
    );
}
