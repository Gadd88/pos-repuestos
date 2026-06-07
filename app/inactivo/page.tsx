
export default function PendingPage() {
    return (
        <div className="container flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Cuenta pendiente</h1>
                <p className="text-muted-foreground">
                    Tu negocio aún no fue activado.
                </p>
            </div>
        </div>
    );
}

// const router = useRouter()
// const { usuario, refreshSession } = useAuthStore();

// useEffect(() => {
//     if (usuario?.negocioId) {
//         const ref = doc(db, "negocios", usuario.negocioId);
//         const unsubscribe = onSnapshot(ref, (snapshot) => {
//             if(snapshot.exists()) {
//                 const negocioData = snapshot.data();
//             }
//         })
//         const refresh = async () => {
//             await refreshSession();
//             router.push("/admin")
//         };

//         refresh();
//     }
// }, []);