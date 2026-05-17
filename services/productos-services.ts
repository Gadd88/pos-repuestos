import { ProductoType } from "@/lib/types";
import { clientAuth } from "@/lib/firebase-client"

export const tokenUsuario = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = clientAuth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (!user) return reject(new Error("No autenticado"));
            const token = await user.getIdToken();
            resolve(token);
        });
    });
}


export const fetchProductos = async () => {
    const token = await tokenUsuario();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos`, {
            next: { revalidate: 180 },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error al obtener productos: ${errorText}`);
            // throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const productos: ProductoType[] = await response.json();
        return productos.filter(producto => producto.activo !== false);
    } catch (error) {
        console.error("Error al obtener productos");
        throw error;
    }
};

export const agregarProductoService = async (
    productoData: Partial<Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">>,
): Promise<ProductoType> => {
    const token = await tokenUsuario();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
    const token = await tokenUsuario();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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


    const token = await tokenUsuario();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });


    if (!response.ok) {
        const errorText = await response.text()
        console.error(`Respuesta del servidor: ${errorText}`)
        throw new Error(`Error: ${response.status}:${errorText}`);
    }

    return true;
};

// export const obtenerProductoPorId = async (id: ProductoType["id"]): Promise<ProductoType> => {
//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productos/${id}`);
//         const producto = await response.json();
//         return producto as ProductoType;
//     } catch (error) {
//         console.error("Error al obtener el producto por ID", error);
//         throw error;
//     }
// }