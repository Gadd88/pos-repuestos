import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { FieldValue } from "firebase-admin/firestore";
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const { negocioId, uid } = await obtenerUsuarioDesdeRequest(req);

    const usuarioSnap = adminDb.collection("usuarios").doc(uid).get();
    if (!usuarioSnap) {
        return NextResponse.json(
            {
                success: false,
                error: "Usuario no encontrado"
            },
            {
                status: 404
            }
        );
    }

    const usuarioData = (await usuarioSnap).data();

    if (usuarioData?.negocioId !== negocioId) {
        return NextResponse.json(
            {
                error: "Usuario no pertenece al negocio",
            },
            { status: 403 }
        );
    }

    const vendedorNombre = usuarioData?.nombreUsuario ?? usuarioData?.email ?? uid;

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

            // Opcional: vencimiento de presupuestos
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
                return { ref: snap.ref, stock: producto.stock as number, nombre: producto.nombre, cantidad: items[i].cantidad };
            });

            // 2. TODAS LAS ESCRITURAS
            productosData.forEach((producto, i) => {
                tx.update(producto.ref, {
                    stock: producto.stock - items[i].cantidad,
                });
                registrarMovimientoStock({
                    tx,
                    negocioId,
                    productoId: producto.ref.id,
                    productoNombre: producto.nombre,
                    tipo: "venta",
                    cantidad: -producto.cantidad,
                    stockAnterior: producto.stock,
                    stockNuevo: producto.stock - producto.cantidad,
                    ventaId: ventaRef.id,
                    usuarioId: uid,
                    usuarioNombre: vendedorNombre,
                    motivo: "Confirmación de presupuesto"
                });
            });

            tx.update(ventaRef, {
                estado: "completada",
                metodo_pago: ventaData.metodo_pago ?? "efectivo",
                confirmadoEn: FieldValue.serverTimestamp(),
                fechaVenta: FieldValue.serverTimestamp(),
                actualizadoEn: FieldValue.serverTimestamp(),
                confirmadoPor: uid
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