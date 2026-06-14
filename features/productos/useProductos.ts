import { useQuery } from "@tanstack/react-query";
import { ProductoType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductos, agregarProductoService, editarProductoService, eliminarProductoService } from "@/services/productos-services";

export const useListarProductos = () => {
  return useQuery<ProductoType[], Error>({
    queryKey: ["productos"],
    queryFn: fetchProductos,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

type AgregarProductoInput = {
  productData: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>;
};

export const useAgregarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductoType, Error, AgregarProductoInput>({
    mutationFn: ({productData}) => agregarProductoService(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ProductoType["id"]) => eliminarProductoService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};