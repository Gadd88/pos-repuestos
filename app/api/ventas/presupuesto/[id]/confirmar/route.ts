import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);

    // if (data?.negocioId !== negocioId) {
    //     return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    // }

    try {
        const resultado = await adminDb.runTransaction(async (tx) => {
            const ventaRef = adminDb.collection("ventas").doc(id);
            const ventaSnap = await tx.get(ventaRef);

            if (!ventaSnap.exists) {
                throw new Error("Presupuesto no encontrado");
            }

            const ventaData = ventaSnap.data()!;

            if (ventaData.negocioId !== negocioId) {
                throw new Error("No autorizado");
            }

            if (ventaData.estado !== "presupuesto") {
                throw new Error("El documento no es un presupuesto o ya fue confirmado");
            }

            // Opcional: si manejás vencimiento de presupuestos
            // if (ventaData.expiracion?.toDate() < new Date()) {
            //     throw new Error("El presupuesto está vencido");
            // }

            const items = ventaData.items as {
                idProducto: string;
                nombre: string;
                cantidad: number;
                precio_unitario: number;
            }[];

            // 1. TODAS LAS LECTURAS
            const productosRefs = items.map((item) =>
                adminDb.collection("productos").doc(item.idProducto)
            );
            const productosSnaps = await Promise.all(
                productosRefs.map((ref) => tx.get(ref))
            );

            // Validaciones
            const productosData = productosSnaps.map((snap, i) => {
                if (!snap.exists) {
                    throw new Error(`Producto no encontrado: ${items[i].nombre}`);
                }
                const producto = snap.data()!;
                if (producto.stock < items[i].cantidad) {
                    throw new Error(`Sin stock suficiente: ${items[i].nombre}`);
                }
                return { ref: snap.ref, stock: producto.stock as number };
            });

            // 2. TODAS LAS ESCRITURAS
            productosData.forEach((producto, i) => {
                tx.update(producto.ref, {
                    stock: producto.stock - items[i].cantidad,
                });
            });

            tx.update(ventaRef, {
                estado: "completada",
                confirmadoEn: FieldValue.serverTimestamp(),
                actualizadoEn: FieldValue.serverTimestamp(),
            });

            return { id: ventaRef.id, ...ventaData, estado: "completada" };
        });

        return NextResponse.json(resultado, { status: 200 });
    } catch (error) {
        console.error("Error al confirmar presupuesto", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al confirmar presupuesto",
            },
            { status: 400 },
        );
    }
}