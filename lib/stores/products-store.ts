// import { create } from "zustand";
// import {
//     agregarProductoService, editarProductoService, eliminarProductoService, fetchProductos
// } from "@/services/productos-services";
// import { toast } from "sonner";
// import { ProductoType } from "../types";

// interface ProductosState {
//     productos: ProductoType[];
//     isLoading: boolean;
//     error: string | null;
//     listarProductos: () => Promise<void>;
//     agregarProducto: (
//         producto: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>
//     ) => Promise<boolean>;
//     editarProducto: (
//         id: ProductoType["id"],
//         producto: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>
//     ) => Promise<boolean>;
//     eliminarProducto: (id: string) => Promise<boolean>;
//     obtenerProductoPorId: (id: string) => ProductoType | undefined;
//     obtenerProductosBajoStock: () => ProductoType[];
// }

// export const useProductosStore = create<ProductosState>((set, get) => ({
//     productos: [],
//     isLoading: false,
//     error: null,

//     listarProductos: async () => {
//         set({ isLoading: true, error: null });
//         try {
//             const productos = await fetchProductos();
//             set({ productos, isLoading: false });
//         } catch (error) {
//             set({ error: "Error al obtener productos", isLoading: false });
//         }
//     },

//     agregarProducto: async (
//         productoData
//     ) => {
//         set({ isLoading: true, error: null });
//         const toastId = toast.loading("Agregando producto...")
//         try {
//             await agregarProductoService(productoData);
//             toast.success("Producto agregado", { id: toastId })
//             await get().listarProductos();
//             return true;
//         } catch (error) {
//             set({ error: `Error al agregar el producto, ${error}` });
//             toast.error(`Ocurrió un error, ${error}`, { id: toastId })
//             return false;
//         }
//     },

//     editarProducto: async (id, updates) => {
//         set({ isLoading: true, error: null });
//         const toastId = toast.loading("Actualizando producto")
//         try {
//             const productoActualizado = await editarProductoService(id, updates);
//             toast.success("Producto actualizado", { id: toastId })
//             set((state) => ({
//                 productos: state.productos.map((p) =>
//                     p.id === id ? productoActualizado : p,
//                 ),
//                 isLoading: false,
//             }));
//             return true;
//         } catch (error) {
//             toast.error(`Ocurrió un error, ${error}`, { id: toastId })
//             set({
//                 error: `Error al actualizar el producto, ${error}`,
//                 isLoading: false,
//             });
//             return false;
//         }
//     },

//     eliminarProducto: async (id) => {
//         set({ isLoading: true, error: null });
//         const toastId = toast.loading("Eliminando producto")
//         try {
//             await eliminarProductoService(id);
//             toast.success("Producto eliminado", { id: toastId })
//             set((state) => ({
//                 productos: state.productos.filter((p) => p.id !== id),
//                 isLoading: false,
//             }));

//             return true;
//         } catch (error) {
//             toast.error(`Ocurrió un error, ${error}`, { id: toastId })
//             set({ error: "Error al eliminar producto", isLoading: false });
//             return false;
//         }
//     },

//     obtenerProductoPorId: (id: string) => {
//         return get().productos.find((producto) => producto.id === id);
//     },

//     obtenerProductosBajoStock: () => {
//         const productos = get().productos;
//         return Array.isArray(productos) 
//             ? productos.filter((producto) => producto.stock <= 2)
//             : [];
//         // return (get().productos ?? []).filter((producto) => producto.stock <= 2);
//     },
// }));
