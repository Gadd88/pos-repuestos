import { useInfiniteQuery } from "@tanstack/react-query";
import { ItemCarrito, VentaType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerVentas, crearVenta, cancelarVenta } from "@/services/ventas-services";

type Props = {
  limit?: number;
  desde?: string;
  hasta?: string;
};

export const useListarVentas = ({ limit, desde, hasta }: Props) => {
  return useInfiniteQuery({
    queryKey: ["ventas", limit, desde, hasta],
    queryFn: ({ pageParam }) =>
      obtenerVentas({
        limit,
        desde,
        hasta,
        cursor: pageParam,
      }),
    initialPageParam: null as {
      creadoEn: string;
      id: string;
    } | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return lastPage.nextCursor
    },
    staleTime: 1000 * 60 * 5, // 5 min
  })
};


type GenerarVentaInput = {
  carrito: ItemCarrito[],
  tipo_venta: string,
  metodo_pago: string
};

export const useGenerarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation<VentaType, Error, GenerarVentaInput>({
    mutationFn: ({ carrito, tipo_venta, metodo_pago }) => crearVenta({ carrito, tipo_venta, metodo_pago }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });
};

export const useCancelarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: VentaType["id"]) => cancelarVenta(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      // queryClient.setQueryData<VentaType[]>(["ventas"], (old = []) => old.map((venta) => (venta.id === id ? { ...venta, estado: "cancelada" } : venta)));
    },
  });
};