import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

import { ProductoType } from "@/lib/types";

const COLLECTION_NAME = "productos"

export async function GET() {

    try {
        const productosRef = adminDb.collection(COLLECTION_NAME);
        // const q = query(productosRef, orderBy("nombre", "asc"));
        // const snapshot = await getDocs(q);
        const snapshot = await productosRef.orderBy("nombre", "asc").get();

        const productosList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            creadoEn: doc.data().creadoEn?.toDate() || new Date(),
            actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(),
        })) as ProductoType[];

        return NextResponse.json(productosList)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ sucess: false, error }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const ahora = FieldValue.serverTimestamp();

        const newProducto = {
            ...body,
            creadoEn: ahora,
            actualizadoEn: ahora
        };
        const docRef = await adminDb.collection(COLLECTION_NAME).add(newProducto);
        const createdProducto = { id: docRef.id, ...body, creadoEn: new Date(), actualizadoEn: new Date() } as ProductoType;
        return NextResponse.json(createdProducto, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }

}