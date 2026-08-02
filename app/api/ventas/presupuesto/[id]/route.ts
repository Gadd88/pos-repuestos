import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    
    const { id } = await params 
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);
    
    try {
        const doc = await adminDb
            .collection("ventas")
            .doc(id)
            .get();

        if (!doc.exists) {
            return NextResponse.json(
                { error: "No encontrado" },
                { status: 404 }
            );
        }

        const data = doc.data();

        if (data?.negocioId !== negocioId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        if (data?.estado !== "presupuesto") {
            return NextResponse.json(
                { error: "No es un presupuesto" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            id: doc.id,
            ...data,
            creadoEn: data?.creadoEn?.toDate(),
            expiracion: data?.expiracion?.toDate(),
        });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}