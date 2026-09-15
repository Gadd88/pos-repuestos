import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { ProductoType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getProductoById } from "@/lib/db/productos";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock";


const COLLECTION_NAME = "productos"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {

    const { id } = await params;

    const producto = await getProductoById(id);

    if (!producto) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(producto);
}

// export async function PUT(
//     req: Request,
//     { params }: { params: Promise<{ id: string }> },
// ): Promise<NextResponse> {

//     const { rol, negocioId, uid } = await obtenerUsuarioDesdeRequest(req)

//     const usuarioSnap = adminDb.collection("usuarios").doc(uid).get();
//     if (!usuarioSnap) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 error: "Usuario no encontrado"
//             },
//             {
//                 status: 404
//             }
//         );
//     }

//     const usuarioData = (await usuarioSnap).data();

//     if (usuarioData?.negocioId !== negocioId) {
//         return NextResponse.json(
//             {
//                 error: "Usuario no pertenece al negocio",
//             },
//             { status: 403 }
//         );
//     }

//     const vendedorNombre = usuarioData?.nombreUsuario ?? usuarioData?.email ?? uid;

//     const { id } = await params
//     const body = await req.json();
//     const productoEditado = {
//         ...body,
//         actualizadoEn: FieldValue.serverTimestamp(),
//     } as ProductoType;


//     try {
//         const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
//         const productoExistente = (await docRef.get()).data() as ProductoType;

//         if (rol !== "admin" || productoExistente.negocioId !== negocioId) {
//             return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
//         }

//         await docRef.update({
//             ...productoEditado,
//             actualizadoEn: FieldValue.serverTimestamp(),
//         });

//         return NextResponse.json(productoEditado, { status: 200 });
//     }
//     catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, error }, { status: 500 });
//     }
// }
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {

    const { rol, negocioId, uid } =
        await obtenerUsuarioDesdeRequest(req);

    const usuarioSnap = await adminDb
        .collection("usuarios")
        .doc(uid)
        .get();

    if (!usuarioSnap.exists) {
        return NextResponse.json(
            {
                success: false,
                error: "Usuario no encontrado",
            },
            {
                status: 404,
            }
        );
    }

    const usuarioData = usuarioSnap.data();

    if (usuarioData?.negocioId !== negocioId) {
        return NextResponse.json(
            {
                error: "Usuario no pertenece al negocio",
            },
            { status: 403 }
        );
    }

    const usuarioNombre =
        usuarioData?.nombreUsuario ??
        usuarioData?.email ??
        uid;

    const { id } = await params;

    const body = await req.json();

    try {
        const docRef = adminDb
            .collection(COLLECTION_NAME)
            .doc(id);

        const productoExistenteSnap =
            await docRef.get();

        if (!productoExistenteSnap.exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        const productoExistente =
            productoExistenteSnap.data() as ProductoType;

        if (
            rol !== "admin" ||
            productoExistente.negocioId !== negocioId
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 403 }
            );
        }

        const stockAnterior =
            Number(productoExistente.stock ?? 0);

        const stockNuevo =
            body.stock !== undefined
                ? Number(body.stock)
                : stockAnterior;

        const diferenciaStock =
            stockNuevo - stockAnterior;

        const productoEditado = {
            ...body,
            actualizadoEn:
                FieldValue.serverTimestamp(),
        } as ProductoType;

        await adminDb.runTransaction(async (tx) => {

            // Actualizamos el producto
            tx.update(docRef, {
                ...productoEditado,
                actualizadoEn:
                    FieldValue.serverTimestamp(),
            });

            // Solo registramos movimiento si realmente cambió el stock
            if (diferenciaStock !== 0) {
                registrarMovimientoStock({
                    tx,
                    negocioId,
                    productoId: id,
                    productoNombre:
                        body.nombre ??
                        productoExistente.nombre,
                    tipo: "ajuste",
                    cantidad: diferenciaStock,
                    stockAnterior,
                    stockNuevo,
                    usuarioId: uid,
                    usuarioNombre,
                    motivo: "Ajuste manual de stock",
                });
            }
        });

        return NextResponse.json(
            productoEditado,
            { status: 200 }
        );

    } catch (error) {

        console.error(
            "Error al editar producto:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al editar producto",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    const { id } = await params;

    const { rol, negocioId } = await obtenerUsuarioDesdeRequest(req)

    if (!id) return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });

    try {

        const docRef = adminDb.collection(COLLECTION_NAME).doc(id);

        const docSnap = await docRef.get();

        if (rol !== "admin" || negocioId !== (docSnap.data()?.negocioId)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        // console.log("🔴 DELETE Documento encontrado:", docSnap);
        if (!docSnap.exists) return NextResponse.json({ error: "El producto no existe" }, { status: 404 });

        await docRef.delete();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        // console.error("🔴 Error en DELETE handler:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
