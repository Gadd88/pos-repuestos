import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {

    const cookieStore = await cookies()
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token requerido" }, { status: 400 });
        }

        //verificar token
        const decoded = await adminAuth.verifyIdToken(token);
        const userId = decoded.uid;

        //usuario
        const usuarioDoc = await adminDb.collection("usuarios").doc(userId).get();
        const usuario = usuarioDoc.data();

        //negocio
        const negocioDoc = await adminDb.collection("negocios").doc(usuario?.negocioId).get();
        const negocio = negocioDoc.data();

        //nueva sesión
        const sessionData = {
            userId,
            email: usuario?.email,
            negocioId: usuario?.negocioId,
            activo: negocio?.activo ?? false,
            estado: negocio?.estado,
            esSuperAdmin: usuario?.rol === "superadmin",
        };

        // 🍪 actualizar cookie
        cookieStore.set("session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ success: true, activo: sessionData.activo });

    } catch (err) {
        console.error("Refresh error:", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}