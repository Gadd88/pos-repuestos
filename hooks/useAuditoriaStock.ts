import { useQuery } from "@tanstack/react-query";

import {
    obtenerConfiguracionAuditoriaStock,
} from "@/services/movimientos-stock.services";

export const useAuditoriaStock = () => {
    return useQuery({
        queryKey: ["configuracionAuditoriaStock"],

        queryFn:
            obtenerConfiguracionAuditoriaStock,

        staleTime: 5 * 60 * 1000,

        refetchOnWindowFocus: false,
    });
};