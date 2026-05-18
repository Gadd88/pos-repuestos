// /api/users/invite
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { UsuarioType } from "@/lib/types";
import { NextResponse } from "next/server";

const COLLECTION_NAME = "usuarios"

export async function GET(req: Request) {

  const { negocioId } = await obtenerUsuarioDesdeRequest(req)

  try {
    const usuariosRef = adminDb.collection(COLLECTION_NAME);
    const snapshot = await usuariosRef.where("negocioId", "==", negocioId).where("rol", "==", "vendedor").get();

    const usuariosList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as UsuarioType[];

    return NextResponse.json(usuariosList)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ sucess: false, error }, { status: 500 })
  }
}

export async function POST(req: Request) {

  const { negocioId } = await obtenerUsuarioDesdeRequest(req)


  const { email, rol, password } = await req.json();

  // revisamos numero de usuarios creados - max 1
  const usuariosRef = adminDb.collection(COLLECTION_NAME);
  const snapshot = await usuariosRef.where("negocioId", "==", negocioId).where("rol", "==", "vendedor").get();

  if (snapshot.size >= 1) {
    return NextResponse.json({ success: false, error: "Solo se puede crear un vendedor por negocio." }, { status: 400 });
  }

  // 1. Crear usuario
  const nuevoUsuario = await adminAuth.createUser({ email, password });

  // 2. Claims
  await adminAuth.setCustomUserClaims(nuevoUsuario.uid, {
    rol,
    negocioId,
  });

  // 3. Firestore
  await adminDb.collection("usuarios").doc(nuevoUsuario.uid).set({
    email,
    rol,
    negocioId,
    activo: true,
    creadoEn: new Date(),
  });

  return Response.json({ success: true, usuario: nuevoUsuario });
}

export async function DELETE(req: Request) {

  const { id } = await req.json();
  const { negocioId } = await obtenerUsuarioDesdeRequest(req)

  try {
    const userDoc = await adminDb.collection("usuarios").doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }
    const userData = userDoc.data();

    if (userData?.negocioId !== negocioId) {
      return NextResponse.json({ success: false, error: "Acción no permitida" }, { status: 403 });
    }

    if (userData?.rol === "admin") {
      return NextResponse.json({ success: false, error: "No se puede eliminar un administrador" }, { status: 400 });
    }

    await adminAuth.deleteUser(id);

    await adminDb.collection(COLLECTION_NAME).doc(id).delete();

    return NextResponse.json({ success: true, mensaje: "Vendedor eliminado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}