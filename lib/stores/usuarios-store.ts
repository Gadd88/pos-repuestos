import { create } from "zustand";
import { UsuarioType } from "../types";
import { eliminarVendedorDB, generarUsuarioVendedor, obtenerUsuarios } from "@/services/usuarios-services";
import { toast } from "sonner";

interface AuthState {
    usuarios: UsuarioType[] | null;
    loading: boolean;
    error: string | null;
    setUsuarios: (usuarios: UsuarioType[] | null) => void;
    setLoading: (arg: boolean) => void;
    obtenerUsuarios: () => Promise<void>;
    generarVendedor: (nombre: string, email: string, password: string) => Promise<void>;
    eliminarVendedor: (id: string) => Promise<void>;
}

export const useUsuarioStore = create<AuthState>((set) => ({
    usuarios: [],
    loading: true,
    error: null,

    setUsuarios: (usuarios) => set({ usuarios, loading: false }),
    
    setLoading: (arg) => set({ loading: arg }),

    obtenerUsuarios: async () => {
        try {
            const usuarios = await obtenerUsuarios();
            set({ usuarios, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            console.error("Error al obtener usuarios", err);
        }
    },
    generarVendedor: async (nombre: string,email: string, password: string) => {
        set({ loading: true, error: null });
        const toastId = toast.loading("Generando vendedor...")
        try{
            const nuevoVendedor = await generarUsuarioVendedor(nombre, email, password);
            set((state) => ({
                usuarios: [...state.usuarios || [], nuevoVendedor],
                loading: false
             }));
            toast.success("Vendedor generado exitosamente", { id: toastId });
        } catch (err) {
            set({ error: err.error, loading: false });
            toast.error(`${err.error}`, { id: toastId });
            throw err;
        }
    },
    eliminarVendedor: async (id: string) => {
        set({ loading: true, error: null });
        const toastId = toast.loading("Eliminando vendedor...")
        try {
            await eliminarVendedorDB(id)
            // Implementar función para eliminar vendedor
            toast.success("Vendedor eliminado", { id: toastId })
            set((state) => ({
                usuarios: state.usuarios?.filter((u) => u.id !== id),
                loading: false
            }))
        } catch (err) {
            toast.error(`Error al eliminar vendedor, ${err}`, { id: toastId })
            set({ error: `Error al eliminar vendedor, ${err}`, loading: false });
        }
        // Implementar función para eliminar vendedor
    }
}));
