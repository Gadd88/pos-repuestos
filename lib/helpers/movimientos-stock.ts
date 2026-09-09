import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type RegistrarMovimientoParams = {
    tx: FirebaseFirestore.Transaction;
    negocioId: string;
    productoId: string;
    productoNombre: string;
    tipo: "venta" | "cancelacion_venta" | "ajuste" | "compra";
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    ventaId?: string;
    usuarioId?: string;
    usuarioNombre?: string;
    motivo?: string;
};

export function registrarMovimientoStock({
    tx,
    negocioId,
    productoId,
    productoNombre,
    tipo,
    cantidad,
    stockAnterior,
    stockNuevo,
    ventaId,
    usuarioId,
    usuarioNombre,
    motivo,
}: RegistrarMovimientoParams) {

    const movimientoRef = adminDb
        .collection("movimientosStock")
        .doc();

    tx.set(movimientoRef, {
        negocioId,
        productoId,
        productoNombre,
        tipo,
        cantidad,
        stockAnterior,
        stockNuevo,
        ventaId: ventaId ?? null,
        usuarioId: usuarioId ?? null,
        usuarioNombre: usuarioNombre ?? null,
        motivo: motivo ?? null,
        creadoEn: FieldValue.serverTimestamp(),
    });
}