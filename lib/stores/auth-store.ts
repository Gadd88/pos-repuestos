import { create } from "zustand";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth, db } from "../firebase";
// import Cookie from 'js-cookie'
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
    refreshSession: () => Promise<any>
}

const SESSION_COOKIE = `path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;


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
            await userCredentials.user.getIdTokenResult();
            const userDoc = await getDoc(doc(db, "usuarios", userCredentials.user.uid));
            const token = await userCredentials.user.getIdToken()
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al iniciar sesión: ${errorText}`);
            }
            // cookies().set("session", token, { path: "/", maxAge: 7 * 24 * 60 * 60, sameSite: "lax", secure: true }); PARA SERVIDOR
            // document.cookie = `session=${token}; ${SESSION_COOKIE}`;
            set({ loading: false, user: userCredentials.user, usuario: userDoc.data() as UsuarioType });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            document.cookie = `session=; path=/; max-age=0; SameSite=Lax; Secure`;
            await fetch("/api/auth/session", {
                method: "DELETE",
            })
            set({ user: null, loading: false, usuario: null });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            console.error("Error al salir", err);
        }
    },
    refreshSession: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken(true); // 👈 fuerza refresh

            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            return data;

        } catch (err) {
            console.error("Error refreshing session", err);
        }
    }
}));
