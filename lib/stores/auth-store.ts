import { create } from "zustand";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth, db } from "../firebase";
import Cookie from 'js-cookie'
import { doc, getDoc } from "firebase/firestore";
import { UsuarioType } from "../types";

interface AuthState {
    user: User | null;
    usuario: UsuarioType | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setUsuario: (usuario: UsuarioType | null) => void;
    setLoading: (arg: boolean) => void;
    loginEmail: (email: string, pass: string) => Promise<void>;
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    usuario: null,
    loading: true,
    error: null,

    setUser: (user) => set({ user, loading: false }),
    setUsuario: (usuario) => set({ usuario }),

    setLoading: (arg) => set({ loading: arg }),

    loginEmail: async (email, pass) => {
        set({ loading: true, error: null });
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, pass);
            const userDoc = await getDoc(doc(db, "usuarios", userCredentials.user.uid));
            const token = await userCredentials.user.getIdToken()
            Cookie.set('session', token, {expires: 7})
            set({ loading: false, user: userCredentials.user, usuario: userDoc.data() as UsuarioType });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            Cookie.remove('session')
            set({ user: null, loading: false, usuario: null });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            console.error("Error al salir", err);
        }
    },
}));
