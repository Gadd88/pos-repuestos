import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";



export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const { token } = await req.json();
        
        if (!token) {
            return NextResponse.json({ error: "Token requerido" }, { status: 400 });
        }

        // 🔐 Verificar token con Firebase Admin
        const decodedToken = await adminAuth.verifyIdToken(token);
        // console.log("🔵 Token verificado, UID:", decodedToken.uid);

        // 🍪 Crear cookie segura
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 días
        });

        return NextResponse.json({
            success: true,
            uid: decodedToken.uid,
        });
    } catch (error) {
        console.error("Error creando sesión:", error);
        return NextResponse.json(
            { error: "Token inválido" },
            { status: 401 }
        );
    }
}

// 🔴 Para logout
export async function DELETE() {
    const cookieStore = await cookies();
    
    cookieStore.set("session", "", {
        path: "/",
        maxAge: 0,
    });

    return NextResponse.json({ success: true });
}