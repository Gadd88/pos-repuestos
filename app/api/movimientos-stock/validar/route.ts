import { FieldPath } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { InconsistenciaStock } from "@/lib/types";

const MOVIMIENTOS_COLLECTION = "movimientosStock";
const PRODUCTOS_COLLECTION = "productos";

// type Inconsistencia = {
//     productoId: string;
//     productoNombre: string;
//     tipo:
//     | "cantidad_incorrecta"
//     | "ruptura_continuidad"
//     | "stock_actual_incorrecto";
//     detalle: string;
//     movimientoId?: string;
//     fechaMovimiento?: string;
//     movimientoAnterior?: {
//         id: string,
//         stockNuevo: number,
//         fecha: string
//     };
//     stockAnteriorRegistrado?: number;
// };

export async function GET(req: NextRequest) {
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);


    try {
        // verificar punto de inicio de auditoria
        const configuracionSnapshot = await adminDb
            .collection("configuracionStock")
            .doc(negocioId)
            .get();

        if (!configuracionSnapshot.exists) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La auditoría de stock todavía no fue iniciada",
                },
                { status: 400 }
            );
        }

        const configuracion = configuracionSnapshot.data();

        const inicioAuditoria = configuracion?.inicioAuditoria;

        if (!inicioAuditoria) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La configuración de auditoría no tiene fecha de inicio",
                },
                { status: 500 }
            );
        }

        // 1. Obtener movimientos del negocio

        const { searchParams } = new URL(req.url);
        const productoIdFiltro = searchParams.get("productoId");

        let movimientosQuery = adminDb
            .collection(MOVIMIENTOS_COLLECTION)
            .where("negocioId", "==", negocioId)
            .where("creadoEn", ">=", inicioAuditoria);

        if (productoIdFiltro) {
            movimientosQuery = movimientosQuery.where(
                "productoId",
                "==",
                productoIdFiltro
            );
        }

        const movimientosSnapshot =
            await movimientosQuery
                .orderBy("productoId", "asc")
                .orderBy("creadoEn", "asc")
                .orderBy(FieldPath.documentId(), "asc")
                .get();

        // 2. Obtener productos actuales del negocio

        let productosQuery = adminDb
            .collection(PRODUCTOS_COLLECTION)
            .where("negocioId", "==", negocioId);

        if (productoIdFiltro) {
            productosQuery = productosQuery.where(
                FieldPath.documentId(),
                "==",
                productoIdFiltro
            );
        }

        const productosSnapshot = await productosQuery.get();

        const productos = new Map<
            string,
            {
                id: string;
                nombre: string;
                stock: number;
            }
        >();

        for (const doc of productosSnapshot.docs) {
            const data = doc.data();

            productos.set(doc.id, {
                id: doc.id,
                nombre: data.nombre ?? "Producto sin nombre",
                stock: Number(data.stock ?? 0),
            });
        }

        // 3. Agrupar movimientos por producto

        const movimientosPorProducto = new Map<
            string,
            {
                id: string;
                productoId: string;
                productoNombre: string;
                cantidad: number;
                stockAnterior: number;
                stockNuevo: number;
                fecha: string | null;
                esCorreccionAuditoria: boolean;
            }[]
        >();

        for (const doc of movimientosSnapshot.docs) {
            const data = doc.data();

            const movimiento = {
                id: doc.id,
                productoId: data.productoId,
                productoNombre:
                    data.productoNombre ??
                    productos.get(data.productoId)?.nombre ??
                    "Producto sin nombre",
                cantidad: Number(data.cantidad ?? 0),
                stockAnterior: Number(data.stockAnterior ?? 0),
                stockNuevo: Number(data.stockNuevo ?? 0),
                fecha: data.creadoEn?.toDate?.()?.toISOString() ?? null,
                esCorreccionAuditoria: data.esCorreccionAuditoria ?? false
            };

            const movimientos = movimientosPorProducto.get(movimiento.productoId) ?? [];

            movimientos.push(movimiento);

            movimientosPorProducto.set(
                movimiento.productoId,
                movimientos
            );
        }

        // 4. Validar consistencia

        const inconsistencias: InconsistenciaStock[] = [];

        for (const [
            productoId,
            movimientos,
        ] of movimientosPorProducto) {

            // 4.1 Validar cada movimiento individualmente

            for (const movimiento of movimientos) {
                const diferencia =
                    movimiento.stockNuevo -
                    movimiento.stockAnterior;

                if (diferencia !== movimiento.cantidad) {
                    inconsistencias.push({
                        productoId,
                        productoNombre: movimiento.productoNombre,
                        tipo: "cantidad_incorrecta",
                        movimientoId: movimiento.id,
                        fechaMovimiento: movimiento.fecha ?? undefined,
                        detalle:
                            `El movimiento indica una cantidad de ${movimiento.cantidad}, ` +
                            `pero el stock pasó de ${movimiento.stockAnterior} ` +
                            `a ${movimiento.stockNuevo}. ` +
                            `La diferencia real es ${diferencia}.`,
                    });
                }
            }

            // 4.2 Validar continuidad entre movimientos

            for (
                let i = 1;
                i < movimientos.length;
                i++
            ) {
                const anterior =
                    movimientos[i - 1];

                const actual = movimientos[i];

                const esCorreccionAuditoria = actual.esCorreccionAuditoria === true;

                if (!esCorreccionAuditoria && anterior.stockNuevo !== actual.stockAnterior) {
                    inconsistencias.push({
                        productoId,
                        productoNombre: actual.productoNombre,
                        tipo: "ruptura_continuidad",
                        movimientoId: actual.id,
                        fechaMovimiento: actual.fecha ?? undefined,
                        movimientoAnterior: {
                            id: anterior.id,
                            stockNuevo: anterior.stockNuevo,
                            fecha: anterior.fecha ?? "",
                        },
                        stockAnteriorRegistrado: actual.stockAnterior,
                        detalle:
                            `El movimiento anterior terminó con stock ${anterior.stockNuevo}, ` +
                            `pero el siguiente movimiento comienza con stock ${actual.stockAnterior}.`,
                    });
                }
            }

            //  4.3 Comparar contra stock actual

            const productoActual =
                productos.get(productoId);

            const ultimoMovimiento =
                movimientos[movimientos.length - 1];

            if (
                productoActual &&
                productoActual.stock !==
                ultimoMovimiento.stockNuevo
            ) {
                inconsistencias.push({
                    productoId,
                    productoNombre: productoActual.nombre,
                    tipo: "stock_actual_incorrecto",
                    movimientoId: ultimoMovimiento.id,
                    fechaMovimiento: ultimoMovimiento.fecha ?? undefined,
                    stockUltimoMovimiento: ultimoMovimiento.stockNuevo,
                    stockActual: productoActual.stock,
                    detalle:
                        `El último movimiento registra un stock de ` +
                        `${ultimoMovimiento.stockNuevo}, ` +
                        `pero el producto actualmente tiene stock ` +
                        `${productoActual.stock}.`,
                });
            }
        }

        // 5. Respuesta

        return NextResponse.json({
            success: true,
            productoId: productoIdFiltro,
            inicioAuditoria: inicioAuditoria.toDate().toISOString(),
            consistente: inconsistencias.length === 0,
            productosRevisados: productosSnapshot.size,
            movimientosRevisados: movimientosSnapshot.size,
            inconsistencias,
        });

    } catch (error) {
        console.error(
            "Error al validar movimientos de stock:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al validar stock",
            },
            { status: 500 }
        );
    }
}