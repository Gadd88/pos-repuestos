import PresupuestoPage from "@/app/presupuesto/[id]/page";
import { ItemCarrito, VentaType } from "@/lib/types";
import { obtenerPresupuesto, crearPresupuestoService } from "@/services/presupuesto.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


type PresupuestoTypeInput = {
    id: VentaType['id']
}

export const useObtenerPresupuesto = (id: VentaType['id']) => {
    return useQuery<VentaType, Error>({
        queryKey: ["presupuesto"],
        queryFn: () => obtenerPresupuesto(id!),
        enabled: !!id,
    });
};

type GenerarPresupuestoInput = {
    carrito: ItemCarrito[],
    tipo_venta: string
}

export const useGenerarPresupuesto = () => {
    const queryClient = useQueryClient()
    return useMutation<VentaType, Error, GenerarPresupuestoInput>({
        mutationFn: ({carrito, tipo_venta}) => crearPresupuestoService({carrito, tipo_venta}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ventas"]})
        }
    })
}