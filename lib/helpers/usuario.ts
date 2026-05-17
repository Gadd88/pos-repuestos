import { adminAuth } from "@/lib/firebase-admin";

export async function obtenerUsuarioDesdeRequest(req: Request) {
    const header = req.headers.get("Authorization");
    const token = header?.split("Bearer ")[1];

    if (!token) throw new Error("Unauthorized");

    const decoded = await adminAuth.verifyIdToken(token);

    //   const decoded = JSON.parse(atob(token.split(".")[1]));

    return {
        uid: decoded.uid,
        negocioId: decoded.negocioId,
        rol: decoded.rol,
    };
}
