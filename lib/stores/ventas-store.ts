// import { create } from "zustand"
// import { cancelarVenta, crearVenta, obtenerVentas } from "@/services/ventas-services"
// import { useCarritoState } from "./carrito-store"
// import { toast } from "sonner"
// import { ItemCarrito, VentaType } from "../types"


// interface VentaState {
//     ventas: VentaType[]
//     isLoading: boolean
//     error: string | null
//     listarVentas: () => Promise<void>
//     generarVenta: (ventaData: { carrito: ItemCarrito[]; tipo_venta: string }) => Promise<void>
//     cancelarVenta: (id: VentaType['id']) => Promise<void>
// }

// export const useVentaStore = create<VentaState>((set, get) => ({
//     ventas: [],
//     isLoading: false,
//     error: null,
//     listarVentas: async () => {
//         set({isLoading: true, error: null})
//         try {
//             const listaVentas: VentaType[] = await obtenerVentas()
//             // const ventasOrdenadas = listaVentas.sort((a, b) => b.id - a.id)
//             set({ventas: listaVentas, isLoading:false, error: null})
//         } catch (error) {
//             console.error(error)
//         }
//     },
//     generarVenta: async (ventaData) => {
//         set({isLoading: true})
//         const toastId = toast.loading("Procesando venta...")
//         try{
//             const nuevaVenta = await crearVenta(ventaData)
//             toast.success(`Venta creada correctamente. Venta: ${nuevaVenta.idVentas}`, {id: toastId})

//             const { vaciarCarrito, setIsOpen } = useCarritoState.getState()
//             setIsOpen(false)
//             vaciarCarrito()

//         }catch(err){
//             toast.error("Error al generar la venta", {id: toastId})
//         }finally{
//             set({isLoading: false, error: null})
//         }
//         // console.log(nuevaVenta)
//     },
//     cancelarVenta: async (id) => {
//         set({isLoading: true})
//         const toastId = toast.loading("Cancelando venta...")
//         try {
//             await cancelarVenta(id)
//             toast.success("Venta cancelada correctamente", {id: toastId})
//             get().listarVentas()
//         } catch (error) {
//             toast.error("Error al cancelar la venta", {id: toastId})
//         } finally {
//             set({isLoading: false, error: null})
//         }
//     }

// }))