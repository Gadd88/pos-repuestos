import { useQuery } from "@tanstack/react-query";

import {
    obtenerResumenMovimientosStock,
} from "@/services/movimientos-stock.services";

type UseResumenMovimientosStockParams = {
    desde: string;
    hasta: string;
};

export const useResumenMovimientosStock = ({
    desde,
    hasta,
}: UseResumenMovimientosStockParams) => {
    return useQuery({
        queryKey: [
            "resumenMovimientosStock",
            desde,
            hasta,
        ],

        queryFn: () =>
            obtenerResumenMovimientosStock({
                desde,
                hasta,
            }),

        enabled: Boolean(desde && hasta),

        staleTime: 60 * 1000,
    });
};