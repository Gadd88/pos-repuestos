import { UsuarioType } from "@/lib/types";
import { eliminarVendedorDB, obtenerUsuariosService } from "@/services/usuarios-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useObtenerUsuarios = () => {
    return useQuery<UsuarioType[], Error>({
        queryKey: ["usuarios"],
        queryFn: async () => {
            return obtenerUsuariosService()
        },
        staleTime: 1000 * 60 * 15, // 15 min
        gcTime: 1000 * 60 * 30,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

}

export const useEliminarUsuario = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: UsuarioType['id']) => eliminarVendedorDB(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    })
}

