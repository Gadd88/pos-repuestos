import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    const { uid, negocioId } = await req.json();

    const usuarioDoc = await adminDb.collection("usuarios").doc(uid).get();
    
    await adminAuth.setCustomUserClaims(uid, {
        negocioId,
        rol: "admin"
    });

    return Response.json({ ok: true });
}