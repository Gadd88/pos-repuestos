import { useQuery } from "@tanstack/react-query";
import { ItemCarrito, VentaType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerVentas, crearVenta, cancelarVenta } from "@/services/ventas-services";

export const useListarVentas = () => {
  return useQuery<VentaType[], Error>({
    queryKey: ["ventas"],
    queryFn: obtenerVentas,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

type GenerarVentaInput = {
    carrito: ItemCarrito[],
    tipo_venta: string
  };

export const useGenerarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation<VentaType, Error, GenerarVentaInput>({
    mutationFn: ({carrito, tipo_venta}) => crearVenta({carrito, tipo_venta}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
};




export const useCancelarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: VentaType["id"]) => cancelarVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
};

