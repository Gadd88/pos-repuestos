// "use client";

// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/stores/auth-store";

// export const AuthGuard = () => {
//     const router = useRouter();
//     const user = useAuthStore((state) => state.user);
//     const loading = useAuthStore((state) => state.loading);
//     const pathname = usePathname();

//     useEffect(() => {
//         if (loading) return;
//         if (!user && pathname.startsWith("/admin")) {
//             router.push("/login");
//             return;
//         }
//         if (user && pathname === "/login") {
//             router.push("/admin");
//             return;
//         }
//     }, [user, loading, router]);

//     // Pantalla de carga mientras Firebase resuelve la sesión
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center">
//                 <div className="neo-card p-8 text-center">
//                     <p
//                         className="font-bold text-lg"
//                         style={{ fontFamily: "var(--font-montserrat)" }}
//                     >
//                         Cargando...
//                     </p>
//                 </div>
//             </div>
//         );
//     }
//     return null;
// };
