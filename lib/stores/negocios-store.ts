import { create } from "zustand"
import { toast } from "sonner"
import { NegocioType } from "../types"
import { activar_negocio, listar_negocios } from "@/services/negocios-services"


interface NegocioState {
    negocios: NegocioType[]
    negocio: NegocioType
    isLoading: boolean
    error: string | null
    listarNegocios: () => Promise<void>
    activarNegocio: (negocioData: NegocioType) => Promise<void>
    obtenerNegocio: (id: NegocioType['id']) => Promise<void>
}

export const useNegocioStore = create<NegocioState>((set, get) => ({
    negocios: [],
    isLoading: false,
    error: null,
    negocio: {} as NegocioType,
    obtenerNegocio: async (id) => {
        set({isLoading: true, error: null})
        try {
            const listadoNegocios = await listar_negocios()
            const negocio = listadoNegocios.find(n => n.id === id)
            set({negocio: negocio || {} as NegocioType, isLoading: false})
        } catch (error) {
            console.error(error)
            set({error: "Error al obtener el negocio", isLoading: false})
        }
    },
    listarNegocios: async () => {
        set({isLoading: true, error: null})
        try {
            const negocios = await listar_negocios()
            set({negocios, isLoading:false, error: null})
        } catch (error) {
            console.error(error)
        }
    },
    activarNegocio: async (negocioData) => {
        set({isLoading: true})
        const toastId = toast.loading("Procesando Negocio...")
        const {id, activo} = negocioData
        try{
            await activar_negocio(id, activo)
            toast.success(`Negocio modificado correctamente. Negocio: ${negocioData.nombre}`, {id: toastId})

        }catch(err){
            toast.error(`Error al activar Negocio: ${err}`, {id: toastId})
            console.error("Error al activar el negocio", err)
        }finally{
            set({isLoading: false, error: null})
        }
    }

}))