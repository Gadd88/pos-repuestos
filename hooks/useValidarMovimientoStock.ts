import { useQuery } from "@tanstack/react-query";

import {
    validarMovimientosStock,
} from "@/services/movimientos-stock.services";

export const useValidarMovimientosStock = ( productoId?: string ) => {
    return useQuery({
        queryKey: ["validacionMovimientosStock", productoId ?? "todos"],
        queryFn: () => validarMovimientosStock(productoId),
        enabled: false,
    });
};