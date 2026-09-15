import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";
import { MovimientoStockType } from "@/lib/types";

const COLLECTION_NAME = "movimientosStock";

export async function GET(req: NextRequest) {
    const { negocioId } =
        await obtenerUsuarioDesdeRequest(req);

    try {
        const { searchParams } = new URL(req.url);
        const desde = searchParams.get("desde");
        const hasta = searchParams.get("hasta");

        if (!desde || !hasta) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Los parámetros desde y hasta son obligatorios",
                },
                { status: 400 }
            );
        }

        const fechaDesde = new Date(`${desde}T00:00:00`);
        const fechaHasta = new Date(`${hasta}T23:59:59.999`);

        if (
            Number.isNaN(fechaDesde.getTime()) ||
            Number.isNaN(fechaHasta.getTime())
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Rango de fechas inválido",
                },
                { status: 400 }
            );
        }

        if (fechaDesde > fechaHasta) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "La fecha desde no puede ser posterior a la fecha hasta",
                },
                { status: 400 }
            );
        }

        const snapshot = await adminDb
            .collection(COLLECTION_NAME)
            .where("negocioId", "==", negocioId)
            .where(
                "creadoEn",
                ">=",
                Timestamp.fromDate(fechaDesde)
            )
            .where(
                "creadoEn",
                "<=",
                Timestamp.fromDate(fechaHasta)
            )
            .get();

        const movimientos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as MovimientoStockType[];

        const resumen = {
            ventas: 0,
            cancelaciones: 0,
            compras: 0,
            ajustes: 0,
            unidadesVendidas: 0,
            unidadesCanceladas: 0,
            unidadesCompradas: 0,
            unidadesAjustadas: 0,
            movimientoNeto: 0,
        };

        const ventasIds = new Set<string>();

        const vendedores: Record<
            string,
            {
                usuarioId: string;
                nombre: string;
                ventas: Set<string>;
                unidadesVendidas: number;
            }
        > = {};

        for (const movimiento of movimientos) {
            const cantidad =
                Number(movimiento.cantidad ?? 0);

            resumen.movimientoNeto += cantidad;

            switch (movimiento.tipo) {
                case "venta": {
                    if (movimiento.ventaId) {
                        ventasIds.add(movimiento.ventaId);
                    };
                    resumen.unidadesVendidas += Math.abs(
                        cantidad
                    );

                    const usuarioId =
                        movimiento.usuarioId ??
                        "sin-usuario";

                    if (!vendedores[usuarioId]) {
                        vendedores[usuarioId] = {
                            usuarioId,
                            nombre:
                                movimiento.usuarioNombre ??
                                "Usuario desconocido",
                            ventas: new Set<string>(),
                            unidadesVendidas: 0,
                        };
                    }

                    vendedores[
                        usuarioId
                    ].unidadesVendidas += Math.abs(cantidad);

                    if (movimiento.ventaId) {
                        vendedores[
                            usuarioId
                        ].ventas.add(movimiento.ventaId);
                    }

                    break;
                }

                case "cancelacion_venta":
                    resumen.cancelaciones += 1;
                    resumen.unidadesCanceladas += Math.abs(
                        cantidad
                    );
                    break;

                case "compra":
                    resumen.compras += 1;
                    resumen.unidadesCompradas += Math.abs(
                        cantidad
                    );
                    break;

                case "ajuste":
                    resumen.ajustes += 1;
                    resumen.unidadesAjustadas += Math.abs(
                        cantidad
                    );
                    break;
            }
        }

        resumen.ventas = ventasIds.size;

        const vendedoresResultado = Object.values(
            vendedores
        ).map((vendedor) => ({
            usuarioId: vendedor.usuarioId,
            nombre: vendedor.nombre,
            ventas: vendedor.ventas.size,
            unidadesVendidas:
                vendedor.unidadesVendidas,
        }));

        return NextResponse.json({
            success: true,
            desde,
            hasta,
            resumen,
            vendedores: vendedoresResultado,
            cantidadMovimientos: movimientos.length,
        });
    } catch (error) {
        console.error(
            "Error al obtener resumen de movimientos:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener resumen",
            },
            { status: 500 }
        );
    }
}