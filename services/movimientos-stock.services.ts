import { tokenUsuario } from "./productos-services";

export type ObtenerMovimientosParams = {
    limit?: number;
    productoId?: string;
    tipo?: string;
    desde?: string;
    hasta?: string;
    cursorFecha?: string;
    cursorId?: string;
};

export const obtenerMovimientosStock = async ({
    limit = 20,
    productoId,
    tipo,
    desde,
    hasta,
    cursorFecha,
    cursorId,
}: ObtenerMovimientosParams = {}) => {
    const token = await tokenUsuario();

    const params = new URLSearchParams();

    params.set("limit", String(limit));

    if (productoId) {
        params.set("productoId", productoId);
    }

    if (tipo) {
        params.set("tipo", tipo);
    }

    if (desde) {
        params.set("desde", desde);
    }

    if (hasta) {
        params.set("hasta", hasta);
    }

    if (cursorFecha && cursorId) {
        params.set("cursorFecha", cursorFecha);
        params.set("cursorId", cursorId);
    }

    const response = await fetch(
        `/api/movimientos-stock?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error al obtener movimientos de stock"
        );
    }

    return data;
};