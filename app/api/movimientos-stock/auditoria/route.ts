import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";

const COLLECTION_NAME = "configuracionStock";

export async function GET(req: NextRequest) {
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);

    try {
        const docRef = adminDb
            .collection(COLLECTION_NAME)
            .doc(negocioId);

        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({
                success: true,
                auditoriaIniciada: false,
                inicioAuditoria: null,
                ultimaValidacion: null
            });
        }

        const data = snapshot.data();

        const ultimaValidacion =
            data?.ultimaValidacion
                ? {
                    ...data.ultimaValidacion,
                    fecha:
                        data.ultimaValidacion.fecha
                            ?.toDate?.()
                            ?.toISOString() ?? null,
                }
                : null;

        return NextResponse.json({
            success: true,
            auditoriaIniciada: true,
            inicioAuditoria:
                data?.inicioAuditoria
                    ?.toDate?.()
                    ?.toISOString() ?? null,
            ultimaValidacion
        });
    } catch (error) {
        console.error(
            "Error al obtener configuración de auditoría:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener configuración",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    _req: NextRequest
) {
    const { negocioId, rol, uid } = await obtenerUsuarioDesdeRequest(_req);

    try {
        if (rol !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Solo un administrador puede iniciar la auditoría",
                },
                { status: 403 }
            );
        }

        const docRef = adminDb
            .collection(COLLECTION_NAME)
            .doc(negocioId);

        const snapshot = await docRef.get();

        if (snapshot.exists) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La auditoría de stock ya fue iniciada",
                },
                { status: 409 }
            );
        }

        await docRef.set({
            negocioId,
            inicioAuditoria: FieldValue.serverTimestamp(),
            iniciadoPor: uid,
            creadoEn: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            message: "Auditoría de stock iniciada correctamente",
        });
    } catch (error) {
        console.error(
            "Error al iniciar auditoría:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al iniciar auditoría",
            },
            { status: 500 }
        );
    }
}