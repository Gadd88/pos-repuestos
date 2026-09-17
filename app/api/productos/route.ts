import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";

import { ProductoType } from "@/lib/types";
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock";

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
    const { negocioId, rol, uid } = await obtenerUsuarioDesdeRequest(req)

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
        
        // creo el producto - genero ID
        const docRef = await adminDb.collection(COLLECTION_NAME).doc()

        const resultado = await adminDb.runTransaction(async (tx) => {
            // const docRef = await adminDb.collection(COLLECTION_NAME).add(newProducto);

            //genero transaccion
            tx.set(docRef, {
                ...newProducto
            });

            registrarMovimientoStock({
                tx,
                negocioId,
                productoId: docRef.id,
                productoNombre: newProducto.nombre,
                tipo: "compra",
                cantidad: newProducto.stock,
                stockAnterior: 0,
                stockNuevo: newProducto.stock,
                usuarioId: uid,
                usuarioNombre: uid,
                motivo: "Nuevo producto agregado",
            });

            return {id: docRef.id, ...newProducto, creadoEn: new Date().toLocaleString("es-AR"), actualizadoEn: new Date().toLocaleString("es-AR")} as ProductoType

        });
        return NextResponse.json(resultado, { status: 201 });
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

        return NextResponse.json({ sucess: true })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error }, { status: 500 })
    }

}