import { VentaType } from "@/lib/types";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { CheckCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmarPresupuesto } from "@/features/presupuestos/usePresupuesto";
import { toast } from "sonner";
import { ReactNode } from "react";

type ConfirmaProps = {
    presupuesto: VentaType | null;
    trigger?: ReactNode; // botón custom opcional
    onConfirmado?: () => void; // callback extra, ej. cerrar un modal padre
};

export const ConfirmaPresupuesto = ({ presupuesto, trigger, onConfirmado }: ConfirmaProps) => {
    const queryClient = useQueryClient();
    const { mutate: confirmarPresupuesto, isPending } = useConfirmarPresupuesto();

    if (!presupuesto) return null;

    const handleConfirmarPresupuesto = (id: VentaType["id"]) => {
        confirmarPresupuesto(id, {
            onSuccess: () => {
                toast.success("Presupuesto confirmado como venta");
                queryClient.invalidateQueries({ queryKey: ["productos"] });
                queryClient.invalidateQueries({ queryKey: ["ventas"] });
                queryClient.invalidateQueries({ queryKey: ["presupuesto", id] });
                onConfirmado?.();
            },
            onError: (error) => {
                toast.error(error.message || "Error al confirmar el presupuesto");
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="outline"
                        disabled={presupuesto.estado === "completada"}
                        className="h-10 w-10 sm:h-9 sm:w-9 border-2 bg-sky-400 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        <CheckCheck className="w-4 h-4" />
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Confirmar este presupuesto?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        ¿Confirmar este presupuesto como venta? Se descontará
                        stock de {presupuesto.items.length} producto(s).
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Volver</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => handleConfirmarPresupuesto(presupuesto.id)}
                        disabled={isPending}
                    >
                        {isPending ? "Confirmando..." : "Sí, confirmar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};