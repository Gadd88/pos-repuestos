import { UsuarioType } from "@/lib/types";
import { tokenUsuario } from "./productos-services";

export const obtenerUsuariosService = async (): Promise<UsuarioType[]> => {

    const token = await tokenUsuario()

    const res = await fetch("/api/auth/usuarios", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error al obtener usuarios: ${errorText}`);
        throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const usuarios: UsuarioType[] = await res.json()
    return usuarios

}


export const generarUsuarioVendedor = async (nombre: string, email: string, password: string) => {
    const token = await tokenUsuario();
    try {
        const res = await fetch("/api/auth/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, email, password, rol: "vendedor" })
        });

        if (!res.ok) {
            const errorText = await res.json();
            throw errorText;
        }
        const data = await res.json();
        return data.usuario;
    } catch (err: unknown) {
        throw err
    }
}

export const eliminarVendedorDB = async (id: string) => {
    const token = await tokenUsuario();

    try {
        const res = await fetch('/api/auth/usuarios/',{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });

        if (!res.ok) {
            const errorText = await res.json();
            throw errorText;
        }
        return await res.json();

    } catch (error) {
        console.error("Error al eliminar vendedor", error);
        throw error;
    }
}