import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock";
import { ProductoType } from "@/lib/types";

const PRODUCTOS_COLLECTION = "productos";

export async function POST(req: NextRequest) {
    const { negocioId, rol, uid } =
        await obtenerUsuarioDesdeRequest(req);

    try {
        if (rol !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Solo un administrador puede corregir diferencias de stock",
                },
                { status: 403 }
            );
        }

        const body = await req.json();

        const productoId = body.productoId;
        const stockCorrecto = Number(body.stockCorrecto);
        const motivo = body.motivo?.trim();

        if (!productoId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "El productoId es obligatorio",
                },
                { status: 400 }
            );
        }

        if (
            !Number.isFinite(stockCorrecto) ||
            stockCorrecto < 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "El stock correcto debe ser un número válido mayor o igual a 0",
                },
                { status: 400 }
            );
        }

        if (!motivo) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "El motivo de la corrección es obligatorio",
                },
                { status: 400 }
            );
        }

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
                { status: 404 }
            );
        }

        const usuarioData = usuarioSnap.data();

        if (usuarioData?.negocioId !== negocioId) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Usuario no pertenece al negocio",
                },
                { status: 403 }
            );
        }

        const usuarioNombre =
            usuarioData?.nombreUsuario ??
            usuarioData?.email ??
            uid;

        const productoRef = adminDb
            .collection(PRODUCTOS_COLLECTION)
            .doc(productoId);

        const productoSnap = await productoRef.get();

        if (!productoSnap.exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Producto no encontrado",
                },
                { status: 404 }
            );
        }

        const producto =
            productoSnap.data() as ProductoType;

        if (producto.negocioId !== negocioId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Producto no pertenece al negocio",
                },
                { status: 403 }
            );
        }

        let stockAnterior = 0;
        let diferencia = 0;

        await adminDb.runTransaction(async (tx) => {
            const productoTransactionSnap = await tx.get(productoRef);

            if (!productoTransactionSnap.exists) {
                throw new Error(
                    "Producto no encontrado"
                );
            }

            const productoActual = productoTransactionSnap.data();

            if ( productoActual?.negocioId !== negocioId ) {
                throw new Error(
                    "Producto no pertenece al negocio"
                );
            }

            stockAnterior = Number(productoActual?.stock ?? 0);

            diferencia = stockCorrecto - stockAnterior;

            if (diferencia === 0) {
                throw new Error(
                    "El stock correcto coincide con el stock actual"
                );
            }

            tx.update(productoRef, {
                stock: stockCorrecto,
                actualizadoEn:
                    FieldValue.serverTimestamp(),
            });

            registrarMovimientoStock({
                tx,
                negocioId,
                productoId,
                productoNombre: productoActual?.nombre ?? producto.nombre,
                tipo: "ajuste",
                cantidad: diferencia,
                stockAnterior,
                stockNuevo: stockCorrecto,
                usuarioId: uid,
                usuarioNombre,
                motivo,
                esCorreccionAuditoria: true
            });
        });

        return NextResponse.json({
            success: true,
            productoId,
            stockAnterior,
            stockNuevo: stockCorrecto,
            diferencia,
            message:
                "Diferencia de stock corregida correctamente",
        });
    } catch (error) {
        console.error(
            "Error al corregir stock:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al corregir stock",
            },
            { status: 500 }
        );
    }
}