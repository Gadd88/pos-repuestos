import { adminDb } from "@/lib/firebase-admin";
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { ItemCarrito, VentaType } from "@/lib/types";
import { FieldPath, FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";


const COLLECTION_NAME = "ventas";

export async function GET(req: NextRequest) {
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);

    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit") ?? 10);
        const desde = searchParams.get("desde");
        const hasta = searchParams.get("hasta");
        const cursorFecha = searchParams.get("cursorFecha");
        const cursorId = searchParams.get("cursorId");
        let query = adminDb
            .collection(COLLECTION_NAME)
            .where("negocioId", "==", negocioId)
            .orderBy("creadoEn", "desc")
            .orderBy(FieldPath.documentId()) //ultimo agregado, cursor compuesto

        if (desde) {
            query = query.where(
                "creadoEn",
                ">=",
                new Date(desde)
            );
        }

        if (hasta) {
            const fechaHasta = new Date(hasta);
            fechaHasta.setHours(
                23,
                59,
                59,
                999
            );
            query = query.where(
                "creadoEn",
                "<=",
                fechaHasta
            );
        }

        /**
         * Cursor
         */

        if (cursorFecha && cursorId) {
            query = query.startAfter(
                Timestamp.fromDate(new Date(cursorFecha)),
                cursorId
            );
        }

        /**
         * Se pide un registro extra para saber
         * si existen más resultados.
         */

        const snapshot = await query
            .limit(limit + 1)
            .get();
        const docs = snapshot.docs;
        const hasMore = docs.length > limit;
        const docsToReturn = hasMore
            ? docs.slice(0, limit)
            : docs;
        const ventas = docsToReturn.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                creadoEn:
                    data.creadoEn?.toDate() ??
                    new Date(),
                actualizadoEn:
                    data.actualizadoEn?.toDate() ??
                    new Date(),
            };
        }) as VentaType[];
        /**
         * Cursor para la próxima página
         */
        let nextCursor: {
            creadoEn: string;
            id: string;
        } | null = null;
        if (ventas.length > 0) {
            const ultimaVenta = ventas[ventas.length - 1];
            nextCursor = {
                creadoEn: ultimaVenta.creadoEn.toISOString(),
                id: ultimaVenta.id,
            };
            // nextCursor =
            //     ventas[
            //         ventas.length - 1
            //     ].creadoEn.toISOString();
        }
        return NextResponse.json({
            ventas,
            hasMore,
            nextCursor
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error
            },
            {
                status: 500
            }
        );
    }
    // try {
    //     const { searchParams } = new URL(req.url);
    //     const limit = Number(searchParams.get("limit") ?? 10);
    //     const desde = searchParams.get("desde");
    //     const hasta = searchParams.get("hasta");
    //     let query = adminDb
    //         .collection(COLLECTION_NAME)
    //         .where("negocioId", "==", negocioId)
    //         .orderBy("creadoEn", "desc");

    //     if (desde) {
    //         query = query.where(
    //             "creadoEn",
    //             ">=",
    //             new Date(desde)
    //         );
    //     }

    //     if (hasta) {
    //         const fechaHasta = new Date(hasta);
    //         fechaHasta.setHours(23, 59, 59, 999);
    //         query = query.where(
    //             "creadoEn",
    //             "<=",
    //             fechaHasta
    //         );
    //     }
    //     const snapshot = await query
    //         .limit(limit)
    //         .get();
    //     const ventasList = snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //         creadoEn: doc.data().creadoEn?.toDate() || new Date(),
    //         actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(),
    //     })) as VentaType[];

    //     return NextResponse.json(ventasList)
    // } catch (error) {
    //     console.error(error)
    //     return NextResponse.json({ sucess: false, error }, { status: 500 })
    // }
}
// const snapshot = await ventasRef.orderBy("creadoEn", "desc").where("negocioId", "==", negocioId).get();

export async function POST(req: NextRequest, res: NextResponse) {
    const ventaData = await req.json();
    const { negocioId, uid } = await obtenerUsuarioDesdeRequest(req)
    const { items } = ventaData as { items: ItemCarrito[] }
    const { tipo_venta } = ventaData as { tipo_venta: 'minorista' | 'mayorista' }
    const { estado, metodo_pago } = ventaData

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

    //por si llegan productos repetidos, medio imposible, pero bueno...
    const itemsConsolidados = Array.from(
        items.reduce((map, item) => {
            const existente = map.get(item.id);

            if (existente) {
                existente.cantidad += item.cantidad;
            } else {
                map.set(item.id, {
                    ...item,
                    cantidad: item.cantidad,
                });
            }

            return map;
        }, new Map<string, ItemCarrito>()).values()
    );

    try {
        const resultado = await adminDb.runTransaction(async (tx) => {
            // 1. PRIMERO TODAS LAS LECTURAS
            // const productosRefs = await adminDb.collection("productos").where(FieldPath.documentId(), "in", items.map((item) => item.id)).get().then(snapshot => {
            //     if (snapshot.empty) {
            //         throw new Error("No se encontraron productos para los IDs proporcionados.");
            //     }
            //     return snapshot.docs.map(doc => doc.ref);
            // });
            const productosRefs = itemsConsolidados.map((item) => adminDb.collection("productos").doc(item.id));

            const productosSnaps = await Promise.all(
                productosRefs.map((ref) => tx.get(ref))
            );

            const productosMap = new Map(
                productosSnaps.map((snap) => [snap.id, snap])
            );

            // validaciones y cálculos
            let total = 0;
            let totalGastado = 0;

            // const productosData = items.map((item) => {
            const productosData = itemsConsolidados.map((item) => {
                const snap = productosMap.get(item.id)
                if (!snap || !snap.exists) {
                    throw new Error(`Producto no encontrado: ID - ${item.nombre}`);
                }
                const producto = snap.data()!;
                const ref = snap.ref;
                if (typeof producto.stock !== "number" || producto.stock < item.cantidad) {
                    throw new Error(`Sin stock suficiente: PRODUCTO - ${item.nombre}`);
                }
                const cantidad = item.cantidad

                const precio_unitario: number =
                    tipo_venta === "mayorista"
                        ? producto.precio_venta_mayorista
                        : producto.precio_venta_minorista;

                total += precio_unitario * cantidad;
                totalGastado += item.precio_compra * cantidad;

                return { ref, data: { ...producto, precio_unitario, stock: producto.stock as number }, nombre: item.nombre, cantidad };
            });

            // 2. LUEGO TODAS LAS ESCRITURAS
            const ventaRef = adminDb.collection("ventas").doc(); // genera ID automático

            tx.set(ventaRef, {
                fecha: FieldValue.serverTimestamp(),
                tipo_venta,
                negocioId,
                vendedorId: uid,
                vendedor_nombre: vendedorNombre,
                cliente: ventaData.cliente || null,
                metodo_pago: metodo_pago || null,
                total: +total.toFixed(2),
                totalGastado: +totalGastado.toFixed(2),
                creadoEn: FieldValue.serverTimestamp(),
                ganancia: +((total - totalGastado)).toFixed(2),
                estado: estado,
                items: productosData.map((item, i) => ({
                    idProducto: productosData[i].ref.id,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio_unitario: productosData[i].data.precio_unitario
                }))
            });

            // if (estado == "completada") {
            //     for (let i = 0; i < items.length; i++) {
            //         tx.update(productosData[i].ref, {
            //             stock: productosData[i].data.stock - items[i].cantidad,
            //         });
            //     }
            // }
            if (estado === "completada") {
                for (let i = 0; i < itemsConsolidados.length; i++) {
                    const item = itemsConsolidados[i];
                    const producto = productosData[i];

                    const stockAnterior = producto.data.stock;
                    const stockNuevo = stockAnterior - producto.cantidad;

                    tx.update(producto.ref, {
                        stock: stockNuevo,
                    });

                    registrarMovimientoStock({
                        tx,
                        negocioId,
                        productoId: producto.ref.id,
                        productoNombre: producto.nombre,
                        tipo: "venta",
                        cantidad: -producto.cantidad,
                        stockAnterior,
                        stockNuevo,
                        ventaId: ventaRef.id,
                        usuarioId: uid,
                        usuarioNombre: vendedorNombre,
                    });
                }
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

