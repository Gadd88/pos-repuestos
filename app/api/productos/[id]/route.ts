import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { ProductoType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getProductoById } from "@/lib/db/productos";

const COLLECTION_NAME = "productos"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  
    const { id } = await params;
  
    const producto = await getProductoById(id);

  if (!producto) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(producto);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {

    const { id } = await params
    const body = await req.json();
    const productoEditado = {
        ...body,
        actualizadoEn: FieldValue.serverTimestamp(),
    } as ProductoType;
    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
        await docRef.update({
            ...productoEditado,
            actualizadoEn: FieldValue.serverTimestamp(),
        });

        return NextResponse.json(productoEditado, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    const { id } = await params;
    // console.log("🔴 DELETE ID recibido para eliminación:", id);

    if (!id) return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });

    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
        const docSnap = await docRef.get();
        // console.log("🔴 DELETE Documento encontrado:", docSnap);
        if (!docSnap.exists) return NextResponse.json({ error: "El producto no existe" }, { status: 404 });

        await docRef.delete();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        // console.error("🔴 Error en DELETE handler:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
