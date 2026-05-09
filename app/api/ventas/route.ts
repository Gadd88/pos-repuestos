import { adminDb } from "@/lib/firebase-admin";
import { ItemCarrito, VentaType } from "@/lib/types";
import { FieldPath, FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";


const COLLECTION_NAME = "ventas";

export async function GET() {
    try {
        const ventasRef = adminDb.collection(COLLECTION_NAME);
        const snapshot = await ventasRef.orderBy("creadoEn", "desc").get();

        const ventasList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            creadoEn: doc.data().creadoEn?.toDate() || new Date(),
            actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(),
        })) as VentaType[];

        return NextResponse.json(ventasList)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ sucess: false, error }, { status: 500 })
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const ventaData = await req.json();
    console.log(ventaData)

    const { items } = ventaData as { items: ItemCarrito[] }
    const { tipo_venta } = ventaData as { tipo_venta: 'minorista' | 'mayorista' }


    try {
        const resultado = await adminDb.runTransaction(async (tx) => {
            // 1. PRIMERO TODAS LAS LECTURAS
            const productosRefs = await adminDb.collection("productos").where(FieldPath.documentId(), "in", items.map((item) => item.id)).get().then(snapshot => {
                if (snapshot.empty) {
                    throw new Error("No se encontraron productos para los IDs proporcionados.");
                }
                return snapshot.docs.map(doc => doc.ref);
            });

            const productosSnaps = await Promise.all(
                productosRefs.map((ref) => tx.get(ref))
            );

            // validaciones y cálculos
            let total = 0;
            let totalGastado = 0;

            const productosData = productosSnaps.map((snap, i) => {
                if (!snap.exists) {
                    throw new Error(`Producto no encontrado: ID - ${items[i].id}`);
                }
                const producto = snap.data()!;
                if (producto.stock < items[i].cantidad) {
                    throw new Error(`Sin stock suficiente: PRODUCTO - ${items[i].nombre}`);
                }

                const precio_unitario: number =
                    tipo_venta === "mayorista"
                        ? producto.precio_venta_mayorista
                        : producto.precio_venta_minorista;

                total += precio_unitario * items[i].cantidad;
                totalGastado += items[i].precio_compra * items[i].cantidad;

                return { ref: productosRefs[i], data: { ...producto, precio_unitario, total, stock: producto.stock as number } };
            });

            // 2. LUEGO TODAS LAS ESCRITURAS
            const ventaRef = adminDb.collection("ventas").doc(); // genera ID automático

            tx.set(ventaRef, {
                fecha: FieldValue.serverTimestamp(),
                tipo_venta,
                total: +total.toFixed(2),
                totalGastado: +totalGastado.toFixed(2),
                creadoEn: FieldValue.serverTimestamp(),
                ganancia: +((total - totalGastado)).toFixed(2),
                items: items.map((item, i) => ({
                    idProducto: productosData[i].ref.id,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio_unitario: productosData[i].data.precio_unitario
                }))
            });

            for (let i = 0; i < items.length; i++) {
                tx.update(productosData[i].ref, {
                    stock: productosData[i].data.stock - items[i].cantidad,
                });
            }

            return { id: ventaRef.id, total, totalGastado, tipo_venta };
        });
        return NextResponse.json(
            {
                idVentas: resultado.id,
                total: resultado.total,
                totalGastado: resultado.totalGastado,
                tipo_venta: resultado.tipo_venta,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error al generar venta", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al generar venta",
            },
            { status: 400 },
        );
    }
}
