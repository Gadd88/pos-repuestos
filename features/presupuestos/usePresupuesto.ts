import PresupuestoPage from "@/app/presupuesto/[id]/page";
import { ItemCarrito, VentaType } from "@/lib/types";
import { obtenerPresupuesto, crearPresupuestoService, confirmarPresupuestoService } from "@/services/presupuesto.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


type PresupuestoTypeInput = {
    id: VentaType['id']
}

export const useObtenerPresupuesto = (id: VentaType['id']) => {
    return useQuery<VentaType, Error>({
        queryKey: ["presupuesto", id],
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

export const useConfirmarPresupuesto = () => {
    const queryClient = useQueryClient();
    return useMutation<VentaType, Error, string>({
        mutationFn: (id) => confirmarPresupuestoService(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["ventas"] });
            queryClient.invalidateQueries({ queryKey: ["presupuesto", id] });
        },
    });
};