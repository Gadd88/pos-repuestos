"use client";

import { useEffect, useState } from "react";
import { VentaDetalleModal } from "./venta-detalle-modal";
import { Eye, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVentaStore } from "@/lib/stores/ventas-store";
import { VentaType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils"; // Utilidad estándar en Shadcn para clases condicionales

export function VentasTable() {
    const { ventas, isLoading, listarVentas } = useVentaStore();
    const [selectedVenta, setSelectedVenta] = useState<VentaType | null>(null);
    const { usuario } = useAuthStore();

    const isAdmin = usuario?.rol === "admin";

    useEffect(() => {
        listarVentas();
    }, [listarVentas]);

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

    // Definimos el grid dinámicamente según el rol
    // Mobile: 2 cols (Fecha, Total) | Desktop Admin: 4 cols | Desktop User: 3 cols
    const gridLayout = isAdmin 
        ? "grid-cols-[1fr_1fr_1fr_auto] md:grid-cols-[1.5fr_1fr_1fr_0.5fr]" 
        : "grid-cols-[1fr_1fr_auto] md:grid-cols-[2fr_1fr_0.5fr]";

    return (
        <>
            <div className="neo-card overflow-hidden border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {/* Header - Oculto en mobile si prefieres un look tipo card, o visible para estructura */}
                <div className={cn(
                    "grid gap-4 px-6 py-4 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider",
                    gridLayout
                )}>
                    <div>Fecha</div>
                    <div className="text-center sm:text-left">Total Venta</div>
                    {isAdmin && <div className="text-center sm:text-left">Ganancia</div>}
                    <div className="text-right">Acción</div>
                </div>

                {/* Body */}
                <div className="divide-y-2 divide-border">
                    {ventas.length === 0 ? (
                        <div className="px-6 py-16 text-center text-muted-foreground italic">
                            No se encontraron registros de ventas.
                        </div>
                    ) : (
                        ventas.map((venta, i) => {
                            const ganancia = venta.total - (venta.totalGastado || 0);
                            const fecha = new Date(venta.creadoEn).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });

                            return (
                                <div
                                    key={venta.id}
                                    className={cn(
                                        "grid gap-4 px-4 sm:px-6 py-4 items-center transition-all hover:bg-muted/30",
                                        gridLayout,
                                        i % 2 === 0 ? "bg-background" : "bg-card/50"
                                    )}
                                >
                                    {/* Fecha */}
                                    <div className="font-medium text-sm sm:text-base">
                                        <span className="sm:hidden text-[10px] text-muted-foreground block uppercase font-bold">Fecha</span>
                                        {fecha}
                                    </div>

                                    {/* Total */}
                                    <div className="font-bold text-base sm:text-lg">
                                        <span className="sm:hidden text-[10px] text-muted-foreground block uppercase font-bold">Total</span>
                                        ${venta.total.toLocaleString("es-AR")}
                                    </div>

                                    {/* Ganancia (Solo Admin) */}
                                    {isAdmin && (
                                        <div className={cn(
                                            "font-bold text-sm sm:text-base flex items-center gap-1",
                                            ganancia >= 0 ? "text-green-600" : "text-destructive"
                                        )}>
                                            <div className="flex items-center gap-1">
                                                ${ganancia.toLocaleString("es-AR")}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botón Detalle */}
                                    <div className="flex justify-end">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-10 w-10 sm:h-9 sm:w-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
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
            </div>

            <VentaDetalleModal
                venta={selectedVenta}
                onClose={() => setSelectedVenta(null)}
            />
        </>
    );
}
// "use client";

// import { useEffect, useState } from "react";
// import { VentaDetalleModal } from "./venta-detalle-modal";
// import { Eye, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useVentaStore } from "@/lib/stores/ventas-store";
// import { VentaType } from "@/lib/types";
// import { useAuthStore } from "@/lib/stores/auth-store";


// export function VentasTable() {
//     const { ventas, isLoading, listarVentas } = useVentaStore();
//     const [selectedVenta, setSelectedVenta] = useState<VentaType | null>(
//         null,
//     );

//     const { usuario } = useAuthStore();

//     useEffect(() => {
//         listarVentas();
//     }, []);

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center py-12">
//                 <div className="text-center space-y-4">
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="text-muted-foreground">
//                         Cargando Ventas...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="neo-card overflow-hidden">
//                 {/* Header de tabla */}
//                 <div
//                     className="grid grid-cols-4 place-content-around gap-2 px-4 py-3 bg-primary text-primary-foreground border-b-2 border-border font-bold text-xs uppercase"
//                     style={{ fontFamily: "var(--font-montserrat)" }}
//                 >
//                     <div className="text-center">Fecha</div>
//                     <div className="text-center">Total Venta</div>
//                     {
//                         usuario?.rol === "admin" && (
//                             <div className="">Ganancia</div>
//                         )
//                     }
//                     <div className="text-end">Detalle</div>
//                 </div>

//                 {/* Filas */}
//                 {ventas.length === 0 ? (
//                     <div className="px-4 py-12 text-center text-muted-foreground">
//                         No hay ventas registradas
//                     </div>
//                 ) : (
//                     ventas.map((venta, i) => {
//                         const ganancia = venta.total - venta.totalGastado;
//                         const isEven = i % 2 === 0;

//                         return (
//                             <div
//                                 key={venta.id}
//                                 className={`grid grid-cols-12 gap-2 px-4 py-3 border-b-2 border-border items-center text-sm transition-colors hover:bg-muted/50 ${isEven ? "bg-background" : "bg-card"}`}
//                             >
//                                 <div
//                                     className="col-span-4"
//                                     style={{
//                                         fontFamily: "var(--font-montserrat)",
//                                     }}
//                                 >
//                                     {new Date(venta.creadoEn).toLocaleDateString(
//                                         "es-AR",
//                                         {
//                                             day: "2-digit",
//                                             month: "2-digit",
//                                             year: "numeric",
//                                         },
//                                     )}
//                                 </div>
//                                 <div
//                                     className="col-span-4 neo-heading text-base"
//                                     style={{
//                                         fontFamily: "var(--font-montserrat)",
//                                     }}
//                                 >
//                                     ${venta.total.toLocaleString("es-AR")}
//                                 </div>
//                                 {
//                                     usuario?.rol === "admin" && (
//                                         <div
//                                             className={`col-span-3 font-bold text-sm ${ganancia >= 0 ? "text-green-600" : "text-destructive"}`}
//                                             style={{
//                                                 fontFamily: "var(--font-montserrat)",
//                                             }}
//                                         >
//                                             ${ganancia.toLocaleString("es-AR")}
//                                         </div>

//                                     )
//                                 }
//                                 <div className="col-span-1 flex justify-end">
//                                     <Button
//                                         size="sm"
//                                         variant="outline"
//                                         className="neo-button h-8 w-8 p-0"
//                                         onClick={() => setSelectedVenta(venta)}
//                                     >
//                                         <Eye className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//             <VentaDetalleModal
//                 venta={selectedVenta}
//                 onClose={() => setSelectedVenta(null)}
//             />
//         </>
//     );
// }
