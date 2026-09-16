import { NextRequest, NextResponse } from "next/server";
import { Filter, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario";

const COLLECTION_NAME = "ventas";

export async function GET(req: NextRequest) {
    const { negocioId } = await obtenerUsuarioDesdeRequest(req);

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

        const fechaDesde = new Date(`${desde}T00:00:00-03:00`);
        const fechaHasta = new Date(`${hasta}T23:59:59.999-03:00`);

        if (Number.isNaN(fechaDesde.getTime()) || Number.isNaN(fechaHasta.getTime())) {
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

        // const fechaDesdeTimestamp = Timestamp.fromDate(fechaDesde);
        // const fechaHastaTimestamp = Timestamp.fromDate(fechaHasta);

        const [ventasCreadasSnapshot, presupuestosConfirmadosSnapshot] = await Promise.all([
            adminDb
                .collection(COLLECTION_NAME)
                .where("negocioId", "==", negocioId)
                .where("estado", "==", "completada")
                .where("creadoEn", ">=", fechaDesde)
                .where("creadoEn", "<=", fechaHasta)
                .get(),
            adminDb
                .collection(COLLECTION_NAME)
                .where("negocioId", "==", negocioId)
                .where("estado", "==", "completada")
                .where("actualizadoEn", ">=", fechaDesde)
                .where("actualizadoEn", "<=", fechaHasta)
                .get(),
        ]);

        const ventasMap = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
        for (const doc of ventasCreadasSnapshot.docs) {
            ventasMap.set(doc.id, doc);
        }

        for (const doc of presupuestosConfirmadosSnapshot.docs) {
            ventasMap.set(doc.id, doc);
        }

        const ventasSnapshotDocs = Array.from(ventasMap.values());
        // const snapshot = await adminDb
        //     .collection(COLLECTION_NAME)
        //     .where("negocioId", "==", negocioId)
        //     .where("estado", "==", "completada")
        //     .where(
        //         Filter.or(
        //             Filter.and(
        //                 Filter.where(
        //                     "creadoEn",
        //                     ">=",
        //                     fechaDesde
        //                 ),
        //                 Filter.where(
        //                     "creadoEn",
        //                     "<=",
        //                     fechaHasta
        //                 )
        //             ),
        //             Filter.and(
        //                 Filter.where(
        //                     "actualizadoEn",
        //                     ">=",
        //                     fechaDesde
        //                 ),
        //                 Filter.where(
        //                     "actualizadoEn",
        //                     "<=",
        //                     fechaHasta
        //                 )
        //             )
        //         )
        //     )
        //     .get();

        // const snapshot = await adminDb
        //     .collection(COLLECTION_NAME)
        //     .where(
        //         "negocioId",
        //         "==",
        //         negocioId
        //     )
        //     .where(
        //         "creadoEn",
        //         ">=",
        //         Timestamp.fromDate(fechaDesde)
        //     )
        //     .where(
        //         "creadoEn",
        //         "<=",
        //         Timestamp.fromDate(fechaHasta)
        //     )
        //     .where(
        //         "estado",
        //         "==",
        //         "completada"
        //     )
        //     .get();

        const resumen = {
            cantidadVentas: 0,
            totalGenerado: 0,
            ganancia: 0,
            unidadesVendidas: 0,
        };

        const metodosPago = {
            efectivo: {
                cantidadVentas: 0,
                total: 0,
            },
            tarjeta: {
                cantidadVentas: 0,
                total: 0,
            },
            transferencia: {
                cantidadVentas: 0,
                total: 0,
            },
            qr: {
                cantidadVentas: 0,
                total: 0,
            },
        };

        const vendedores: Record<string, {
            vendedorId: string;
            vendedorNombre: string;
            cantidadVentas: number;
            totalGenerado: number;
            ganancia: number;
            unidadesVendidas: number;
        }
        > = {};

        for (const doc of ventasSnapshotDocs) {
            const venta = doc.data();
            const total = Number(venta.total ?? 0);
            const totalGastado = Number(venta.totalGastado ?? 0);
            const ganancia = Number(venta.ganancia ?? total - totalGastado);
            const metodoPago = venta.metodo_pago ?? "efectivo";

            resumen.cantidadVentas += 1;
            resumen.totalGenerado += total;
            resumen.ganancia += ganancia;

            const items = Array.isArray(venta.items) ? venta.items : [];

            for (const item of items) {
                resumen.unidadesVendidas +=
                    Number(item.cantidad ?? 0);
            }

            if (metodoPago && metodoPago in metodosPago) {
                const metodo = metodosPago[metodoPago as keyof typeof metodosPago];
                metodo.cantidadVentas += 1;
                metodo.total += total;
            }

            const vendedorId = venta.vendedorId ?? "sin-vendedor";
            const vendedorNombre = venta.vendedor_nombre ?? "Vendedor desconocido";

            if (!vendedores[vendedorId]) {
                vendedores[vendedorId] = {
                    vendedorId,
                    vendedorNombre,
                    cantidadVentas: 0,
                    totalGenerado: 0,
                    ganancia: 0,
                    unidadesVendidas: 0,
                };
            }
            vendedores[vendedorId].cantidadVentas += 1;
            vendedores[vendedorId].totalGenerado += total;
            vendedores[vendedorId].ganancia += ganancia;

            for (const item of items) {
                vendedores[vendedorId].unidadesVendidas += Number(item.cantidad ?? 0);
            }
        }

        const totalPorMetodoPago =
            Object.values(metodosPago).reduce(
                (total, metodo) =>
                    total + metodo.total,
                0
            );

        const totalPorVendedor =
            Object.values(vendedores).reduce(
                (total, vendedor) =>
                    total +
                    vendedor.totalGenerado,
                0
            );

        return NextResponse.json({
            success: true,
            desde,
            hasta,
            resumen: {
                cantidadVentas: resumen.cantidadVentas,
                totalGenerado: Number(resumen.totalGenerado.toFixed(2)),
                ganancia: Number(resumen.ganancia.toFixed(2)),
                unidadesVendidas: resumen.unidadesVendidas,
            },

            metodosPago: {
                efectivo: {
                    cantidadVentas: metodosPago.efectivo.cantidadVentas,
                    total: Number(metodosPago.efectivo.total.toFixed(2)),
                },

                tarjeta: {
                    cantidadVentas: metodosPago.tarjeta.cantidadVentas,
                    total: Number(metodosPago.tarjeta.total.toFixed(2)),
                },

                transferencia: {
                    cantidadVentas: metodosPago.transferencia.cantidadVentas,
                    total: Number(metodosPago.transferencia.total.toFixed(2)
                    ),
                },

                qr: {
                    cantidadVentas: metodosPago.qr.cantidadVentas,
                    total: Number(metodosPago.qr.total.toFixed(2)),
                },

                total: Number(totalPorMetodoPago.toFixed(2)),
            },

            vendedores: Object.values(
                vendedores
            ).map((vendedor) => ({
                ...vendedor,
                totalGenerado: Number(vendedor.totalGenerado.toFixed(2)),
                ganancia: Number(vendedor.ganancia.toFixed(2)),
            })),

            controles: {
                totalPorMetodoPago: Number(totalPorMetodoPago.toFixed(2)),
                totalPorVendedor: Number(totalPorVendedor.toFixed(2)),
                metodosPagoCoinciden: Number(totalPorMetodoPago.toFixed(2)) === Number(resumen.totalGenerado.toFixed(2)),
                vendedoresCoinciden: Number(totalPorVendedor.toFixed(2)) === Number(resumen.totalGenerado.toFixed(2)),
            },
        });
    } catch (error) {
        console.error(
            "Error al obtener resumen diario de caja:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener resumen diario de caja",
            },
            { status: 500 }
        );
    }
}