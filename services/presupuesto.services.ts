import { ItemCarrito, VentaType } from "@/lib/types";
import { tokenUsuario } from "./productos-services";

export const crearPresupuestoService = async (presupuestoData: { carrito: ItemCarrito[]; tipo_venta: string }): Promise<VentaType> => {
    const token = await tokenUsuario()

    const transformarProducto = (producto: ItemCarrito) => {
        return {
            id: producto.id,
            nombre: producto.nombre,
            precio_compra: producto.precio_compra,
            precio_venta: presupuestoData.tipo_venta === "mayorista" ? producto.precio_venta_mayorista : producto.precio_venta_minorista,
            cantidad: producto.cantidad || 1
        };
    };
    const items = presupuestoData.carrito.map((item) => transformarProducto(item));

    const presupuestoDataToSend = {
        tipo_venta: presupuestoData.tipo_venta,
        estado: "completada",
        items
    }

    const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...presupuestoDataToSend,
            estado: "presupuesto",
        }),
    });
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Ocurrió un error al crear el presupuesto")
    return result
};


export const obtenerPresupuesto = async (id: string) => {
    console.log(id)
    const res = await fetch(`/api/ventas/presupuesto/${id}`);

    if (!res.ok) {
        throw new Error("Error al obtener presupuesto");
    }

    return await res.json() as VentaType;
};