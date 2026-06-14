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
import { Trash2Icon } from "lucide-react";
import { useCancelarVenta } from "@/features/ventas/useVentas";
import { useQueryClient } from "@tanstack/react-query";

type EliminarProps = {
    venta: VentaType | null;
};
export const ConfirmaEliminarVenta = ({ venta }: EliminarProps) => {
    if (!venta) return null;
    const queryClient = useQueryClient();
    const { mutateAsync: cancelarVenta } = useCancelarVenta();
    const handleCancelarVenta = async (id: VentaType["id"]) => {
        await cancelarVenta(id);
        queryClient.invalidateQueries({ queryKey: ["productos"] });
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    disabled={venta.estado === "cancelada"}
                    className="h-10 w-10 sm:h-9 sm:w-9 border-2 bg-red-400 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                    <Trash2Icon className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Cancelar esta venta?</AlertDialogTitle>

                    <AlertDialogDescription>
                        Esta acción devolverá el stock de los productos y no se
                        puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Volver</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => handleCancelarVenta(venta.id)}
                    >
                        Sí, cancelar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
