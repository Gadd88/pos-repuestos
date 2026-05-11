import { ProductoType } from "@/lib/types";

export const fetchProductos = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos`, { next: { revalidate: 120 } });
        const productos: ProductoType[] = await response.json();
        return productos.filter(producto => producto.activo !== false);
    } catch (error) {
        console.error("Error al obtener productos");
    }
};

export const agregarProductoService = async (
    productoData: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>,
): Promise<ProductoType> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productoData),
        });

        if (!response.ok) {
            throw new Error("Ocurrió un error al agregar el producto");
        }
        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al agregar el producto");
        throw error;
    }
};

export const editarProductoService = async (
    id: ProductoType["id"],
    updates: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>,
) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`Respuesta del servidor: ${errorText}`)
            throw new Error(`Error: ${response.status}:${errorText}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Fallo al editar el producto");
        throw error;
    }
};

export const eliminarProductoService = async (id: ProductoType["id"]): Promise<boolean> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`, {
        method: "DELETE"
    });
    const result = await response.json();

    if (!response.ok) {
        const errorText = await response.text()
        console.error(`Respuesta del servidor: ${errorText}`)
        throw new Error(`Error: ${response.status}:${errorText}`);
    }

    return result;
};

export const obtenerProductoPorId = async (id: ProductoType["id"]): Promise<ProductoType> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`, { next: { revalidate: 120 } });
        const producto = await response.json();
        return producto as ProductoType;
    } catch (error) {
        console.error("Error al obtener el producto por ID", error);
        throw error;
    }
}