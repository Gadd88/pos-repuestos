import { ResumenMovimientosStock, ValidacionMovimientosStock } from "@/lib/types";
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



export const obtenerResumenMovimientosStock = async ({
    desde,
    hasta,
}: {
    desde: string;
    hasta: string;
}): Promise<ResumenMovimientosStock> => {
    const token = await tokenUsuario();

    const params = new URLSearchParams();

    params.set("desde", desde);
    params.set("hasta", hasta);

    const response = await fetch(
        `/api/movimientos-stock/resumen?${params.toString()}`,
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
            data.error ||
            "Error al obtener resumen de movimientos"
        );
    }

    return data;
};

export const validarMovimientosStock = async (productoId?: string): Promise<ValidacionMovimientosStock> => {
    const token = await tokenUsuario();

    const params = new URLSearchParams();

    if (productoId) {
        params.set("productoId", productoId);
    }
    const queryString = params.toString();

    const response = await fetch(
        `/api/movimientos-stock/validar${queryString ? `?${queryString}` : ""}`,
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
            data.error ||
            "Error al validar movimientos de stock"
        );
    }

    return data;
};

export type ConfiguracionAuditoriaStock = {
    success: boolean;
    auditoriaIniciada: boolean;
    inicioAuditoria: string | null;
};

export const obtenerConfiguracionAuditoriaStock = async (): Promise<ConfiguracionAuditoriaStock> => {
    const token = await tokenUsuario();

    const response = await fetch(
        "/api/movimientos-stock/auditoria",
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
            data.error ||
            "Error al obtener configuración de auditoría"
        );
    }

    return data;
};

export const iniciarAuditoriaStock = async () => {
    const token = await tokenUsuario();

    const response = await fetch(
        "/api/movimientos-stock/auditoria",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Error al iniciar auditoría"
        );
    }

    return data;
};

export type CorregirStockParams = {
    productoId: string;
    stockCorrecto: number;
    motivo: string;
};

export const corregirStock = async ({
    productoId,
    stockCorrecto,
    motivo,
}: CorregirStockParams) => {
    const token = await tokenUsuario();

    const response = await fetch(
        "/api/movimientos-stock/corregir",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productoId,
                stockCorrecto,
                motivo,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Error al corregir stock"
        );
    }

    return data;
};