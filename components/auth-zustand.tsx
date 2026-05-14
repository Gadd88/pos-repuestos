"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/lib/stores/auth-store";
import { doc, getDoc } from "firebase/firestore";
import { UsuarioType } from "@/lib/types";

export const AuthInitializer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const setUser = useAuthStore((state) => state.setUser);
    const setUsuario = useAuthStore((state) => state.setUsuario);

    useEffect(() => {
        // Escucha cambios de sesión (login, logout, refresh)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                document.cookie = `session=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
                const userDoc = await getDoc(doc(db, "usuarios", user.uid));
                if (userDoc.exists()) {
                    setUsuario(userDoc.data() as UsuarioType);
                }
            } else {
                document.cookie = `session=; path=/; max-age=0; SameSite=Lax; Secure`;
                setUsuario(null);
            }
            setUser(user);
        });

        return () => unsubscribe();
    }, [setUser]);

    return <>{children}</>;
};
