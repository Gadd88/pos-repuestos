import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";

import { ProductoType } from "@/lib/types";

const COLLECTION_NAME = "productos"

export async function GET(req: Request) {

    const { negocioId } = await obtenerUsuarioDesdeRequest(req)

    try {
        const productosRef = adminDb.collection(COLLECTION_NAME);
        const snapshot = await productosRef.orderBy("nombre", "asc").where("negocioId", "==", negocioId).where("activo", "==", true).get();

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
    const { negocioId, rol } = await obtenerUsuarioDesdeRequest(req)

    try {
        const body = await req.json();
        const ahora = FieldValue.serverTimestamp();

        const newProducto = {
            ...body,
            negocioId,
            creadoEn: ahora,
            actualizadoEn: ahora
        };

        if (rol !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const docRef = await adminDb.collection(COLLECTION_NAME).add(newProducto);
        const createdProducto = { id: docRef.id, ...body, creadoEn: new Date(), actualizadoEn: new Date() } as ProductoType;
        return NextResponse.json(createdProducto, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }

}

export async function PUT(req: Request) {
    const { negocioId, rol } = await obtenerUsuarioDesdeRequest(req)

    try {
        const { campo, operacion, tipo, valor } = await req.json()
        const ahora = FieldValue.serverTimestamp()

        const bulkWriter = adminDb.bulkWriter();

        const snapshot = await adminDb
            .collection("productos")
            .where("negocioId", "==", negocioId)
            .get();

        if (rol !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        snapshot.docs.forEach((doc) => {
            const producto = doc.data();

            let precioActual = producto[campo];

            let nuevoPrecio = precioActual;

            if (tipo === "porcentaje") {
                const factor = valor / 100;

                nuevoPrecio =
                    operacion === "aumentar"
                        ? precioActual * (1 + factor)
                        : precioActual * (1 - factor);
            } else {
                nuevoPrecio =
                    operacion === "aumentar"
                        ? precioActual + valor
                        : precioActual - valor;
            }

            bulkWriter.update(doc.ref, {
                [campo]: Math.round(nuevoPrecio),
                actualizadoEn: ahora,
            });
        });

        await bulkWriter.close();

        return NextResponse.json({sucess: true})

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error }, { status: 500 })
    }

}