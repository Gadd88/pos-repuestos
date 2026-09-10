import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { MovimientoStockType } from "@/lib/types";

const COLLECTION_NAME = "movimientosStock";

export async function GET(req: NextRequest) {
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);

    try {
        const { searchParams } = new URL(req.url);

        const limit = Math.min(
            Number(searchParams.get("limit") ?? 20),
            100
        );

        const productoId = searchParams.get("productoId");
        const tipo = searchParams.get("tipo");
        const desde = searchParams.get("desde");
        const hasta = searchParams.get("hasta");

        const cursorFecha = searchParams.get("cursorFecha");
        const cursorId = searchParams.get("cursorId");

        let query = adminDb
            .collection(COLLECTION_NAME)
            .where("negocioId", "==", negocioId)
            .orderBy("creadoEn", "desc")
            .orderBy(FieldPath.documentId());

        if (productoId) {
            query = query.where(
                "productoId",
                "==",
                productoId
            );
        }

        if (tipo) {
            query = query.where(
                "tipo",
                "==",
                tipo
            );
        }

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

        if (cursorFecha && cursorId) {
            query = query.startAfter(
                Timestamp.fromDate(
                    new Date(cursorFecha)
                ),
                cursorId
            );
        }

        const snapshot = await query
            .limit(limit + 1)
            .get();

        const docs = snapshot.docs;

        const hasMore = docs.length > limit;

        const docsToReturn = hasMore
            ? docs.slice(0, limit)
            : docs;

        const movimientos =
            docsToReturn.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    ...data,
                    creadoEn:
                        data.creadoEn?.toDate() ??
                        new Date(),
                };
            }) as MovimientoStockType[];

        let nextCursor: {
            creadoEn: string;
            id: string;
        } | null = null;

        if (movimientos.length > 0) {
            const ultimoMovimiento =
                movimientos[
                movimientos.length - 1
                ];

            nextCursor = {
                creadoEn:
                    ultimoMovimiento.creadoEn.toISOString(),
                id: ultimoMovimiento.id,
            };
        }

        return NextResponse.json({
            movimientos,
            hasMore,
            nextCursor,
        });

    } catch (error) {
        console.error(
            "Error al obtener movimientos de stock:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener movimientos de stock",
            },
            {
                status: 500,
            }
        );
    }
}