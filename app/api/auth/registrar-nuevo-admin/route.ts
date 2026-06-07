import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    const { email, password, nombreNegocio } = await req.json();

    const existeUsuario = await adminDb.collection("usuarios")
        .where("email", "==", email)
        .get();

    if (!existeUsuario.empty) {
        return Response.json({ ok: false, error: "Usuario ya registrado con ese email" }, { status: 400 });
    }


    // 1. Crear usuario en Firebase Auth
    const usuario = await adminAuth.createUser({
        email,
        password,
    });

    // 2. Crear negocio
    const negocioRef = await adminDb.collection("negocios").add({
        nombre: nombreNegocio,
        adminId: usuario.uid,
        creadoEn: new Date(),
        activo: false
    });

    const negocioId = negocioRef.id;
    
    // 3. Setear ADMIN
    await adminAuth.setCustomUserClaims(usuario.uid, {
        rol: "admin",
        negocioId,
    });

    // 4. Guardar usuario en DB
    await adminDb.collection("usuarios").doc(usuario.uid).set({
        email,
        rol: "admin",
        negocioId,
        nombreNegocio,
        creadoEn: new Date(),
    });

    return Response.json({ ok: true });
}