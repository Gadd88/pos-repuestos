"use client";
import { useParams } from "next/navigation";
import { useObtenerPresupuesto } from "@/features/presupuestos/usePresupuesto";
import { Loader2 } from "lucide-react";

export default function PresupuestoPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: presupuesto, isLoading, error } = useObtenerPresupuesto(id);

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 w-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    Cargando presupuesto...
                </p>
            </div>
        );

    if (error) return <p>Error al cargar</p>;

    if (!presupuesto)
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-muted-foreground animate-pulse font-medium">
                    No se encuentra el presupuesto solicitado{" "}
                </p>
                ;
            </div>
        );

    const expirado =
        presupuesto?.expiracion &&
        new Date() > new Date(presupuesto.expiracion);

    return (
        <div className="h-full min-h-0 flex flex-col bg-background w-full max-w-2xl">
            {/*Header*/}
            <div className="p-2">
                <div className="flex items-center justify-between neo-card p-3 bg-purple-300 text-white max-w-2xl mx-auto">
                    <h1 className="neo-heading text-2xl font-bold uppercase">
                        Presupuesto
                    </h1>
                </div>

                {expirado && (
                    <div className="bg-red-100 text-red-600 p-2 mt-2 text-center">
                        Este presupuesto está expirado
                    </div>
                )}
            </div>
            {/* BODY */}
            <div className="container p-2">
                <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full neo-card min-h-96">
                    <ul className="space-y-2">
                        {presupuesto.items.map((item) => (
                            <li
                                key={item.idProducto}
                                className="flex justify-between"
                            >
                                <span className="uppercase font-black">
                                    {item.nombre} x{item.cantidad}
                                </span>
                                <span className="font-black">
                                    ${item.precio_unitario}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* TOTAL (FIJO ABAJO) */}
            <div className="p-4 border-t bg-background">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="font-bold text-lg flex justify-between">
                        <span>Total</span>
                        <span>${presupuesto.total}</span>
                    </div>

                    {presupuesto.expiracion && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Válido hasta:{" "}
                            {new Date(
                                presupuesto.expiracion,
                            ).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
