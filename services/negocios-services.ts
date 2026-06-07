import { NegocioType } from "@/lib/types"
import { tokenUsuario } from "./productos-services"

export const listar_negocios = async ():Promise<NegocioType[]> => {
    const token = await tokenUsuario()
    try {
        const response = await fetch('/api/admin/negocios',{
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if(!response.ok){
            const errorText = await response.text()
            console.error("Error al obtener negocios: ${errorText}")
        }
        const result = await response.json()
        return result as NegocioType[]
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const activar_negocio = async (id: string, activo: boolean): Promise<void> => {
    const token = await tokenUsuario()
    try{
        const response = await fetch('/api/admin/negocios', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({id, activo})
        })
        if(!response.ok) {
            const errorText = await response.text();
            console.error(`Error al modificar negocio: ${errorText}`);
        }

        const result = await response.json()
        
        return result 
    }catch(error){
        console.error(error)
        throw error
    }
}