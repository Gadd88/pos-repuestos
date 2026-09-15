import { useInfiniteQuery } from "@tanstack/react-query";

import {
    obtenerMovimientosStock,
    type ObtenerMovimientosParams,
} from "@/services/movimientos-stock.services";

export const useMovimientosStock = (
    params: Omit<
        ObtenerMovimientosParams,
        "cursorFecha" | "cursorId"
    > = {}
) => {
    return useInfiniteQuery({
        queryKey: ["movimientosStock", params],

        queryFn: ({ pageParam }) =>
            obtenerMovimientosStock({
                ...params,
                cursorFecha: pageParam?.creadoEn,
                cursorId: pageParam?.id,
            }),

        initialPageParam: undefined as
            | {
                  creadoEn: string;
                  id: string;
              }
            | undefined,

        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore || !lastPage.nextCursor) {
                return undefined;
            }

            return lastPage.nextCursor;
        },

        staleTime: 60 * 1000,
    });
};
