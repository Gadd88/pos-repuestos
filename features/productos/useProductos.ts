import { useQuery } from "@tanstack/react-query";
import { ProductoType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductos, agregarProductoService, editarProductoService, eliminarProductoService, editarMasivoService, EditarMasivoType } from "@/services/productos-services";

export const useListarProductos = () => {
  return useQuery<ProductoType[], Error>({
    queryKey: ["productos"],
    queryFn: async () => {
      return fetchProductos()
    },
    staleTime: 1000 * 60 * 15, // 15 min
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

type AgregarProductoInput = {
  productData: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>;
};

export const useAgregarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductoType, Error, AgregarProductoInput>({
    mutationFn: ({ productData }) => agregarProductoService(productData),
    onSuccess: (nuevoProducto) => {
      queryClient.setQueryData<ProductoType[]>(["productos"], (old = []) => [...old, nuevoProducto].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      // queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};


type EditarProductoInput = {
  id: ProductoType["id"];
  updates: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>;
};

export const useEditarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductoType, //lo que retorna 
    Error,  // error
    EditarProductoInput //variables de lo que recibe
  >({
    mutationFn: ({ id, updates }) => editarProductoService(id, updates),
    onSuccess: (updates, { id }) => {
      queryClient.setQueryData<ProductoType[]>(["productos"], (old = []) => {
        return old.map((producto) => (producto.id === id ? { ...producto, ...updates } : producto))
      })
      // queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useEditarPrecios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: EditarMasivoType) => editarMasivoService(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    }
  })
}

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ProductoType["id"]) => eliminarProductoService(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<ProductoType[]>(["productos"], (old = []) => old.filter((producto) => producto.id !== id))
      // queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};