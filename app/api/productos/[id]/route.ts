import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { ProductoType } from "@/lib/types";


import { NextResponse } from "next/server";

const COLLECTION_NAME = "productos"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<ProductoType[] | NextResponse> {
    const { id } = await params

    try {
        const productoRef = await adminDb.collection(COLLECTION_NAME).doc(id).get();
        // const productosList = productosRef.docs.map((doc) => ({
        //     id: doc.id,
        //     ...doc.data(),
        //     creadoEn: doc.data().creadoEn?.toDate() || new Date(),
        //     actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(),
        // })) as ProductoType[];
        
        // const producto = productosList.find((p) => p.id === id)

        if (!productoRef) return NextResponse.json("Producto no encontrado", { status: 404 })
        
            return NextResponse.json(JSON.parse(JSON.stringify(productoRef.data())), { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: `Ocurrió un error en el servidor, ${error}` }, { status: 500 })
    }
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
    _: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    const { id } = await params;
    try{
        const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
        await docRef.update({ activo: false });
    
        return NextResponse.json({ success: true }, { status: 200 });
    }catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
