import { ItemCarrito } from "@/lib/types";


export const obtenerVentas = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ventas`, {
        cache: "no-store",
    });
    const result = await response.json();
    return result;
};

export const crearVenta = async (ventaData: { carrito: ItemCarrito[]; tipo_venta: string }) => {

    const transformarProducto = (producto: ItemCarrito) => {
        return {
            id: producto.id,
            nombre: producto.nombre,
            precio_compra: producto.precio_compra,
            precio_venta: ventaData.tipo_venta === "mayorista" ? producto.precio_venta_mayorista : producto.precio_venta_minorista,
            cantidad: producto.cantidad || 1
        };
    };
    const items = ventaData.carrito.map((item) => transformarProducto(item));

    const ventaDataToSend = {
        tipo_venta: ventaData.tipo_venta,
        items
    }

    console.log("Datos a enviar para crear venta:", ventaDataToSend);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ventas`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(ventaDataToSend),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || `Ocurrió un error al realizar venta`);
    return result;
};


