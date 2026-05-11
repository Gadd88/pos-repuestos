import { create } from "zustand";
import { toast } from "sonner";
import { ItemCarrito, ProductoType } from "../types";

interface CarritoState {
    carrito: ItemCarrito[];
    agregarItemCarrito: (arg: ProductoType) => void;
    editarCantidad: (
        id: ItemCarrito["id"],
        cantidad: ItemCarrito["cantidad"],
    ) => void;
    eliminarItem: (id: ItemCarrito["id"]) => void;
    vaciarCarrito: () => void;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void
}


export const useCarritoState = create<CarritoState>((set, get) => ({
    carrito: [],
    isOpen: false,
    setIsOpen: (v) => set({isOpen: v}),
    agregarItemCarrito: (producto) => {
        const itemsCarrito = get().carrito;
        const itemExists = itemsCarrito.find((item) => item.id === producto.id);
        if (itemExists) {
            if (itemExists.cantidad <= itemExists.stockMaximo - 1)
                set({
                    carrito: itemsCarrito.map((item) =>
                        item.id === producto.id
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item,
                    ),
                });
        } else {
            set({
                carrito: [
                    ...itemsCarrito,
                    {
                        ...producto,
                        cantidad: 1,
                        stockMaximo: producto.stock,
                    },
                ],
            });
        }
        toast.success("Item agregado al carrito")
    },
    editarCantidad: (id, cantidad) => {
        const carritoActual = get().carrito;
        const producto = carritoActual.find((item) => item.id === id);
        if (producto) {
            const nuevoCarrito = get().carrito.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          cantidad:
                              cantidad > 0 && cantidad <= producto.stockMaximo
                                  ? cantidad
                                  : item.cantidad,
                      }
                    : item,
            );
            set({ carrito: nuevoCarrito });
        }
        toast.success("Cantidad editada")
    },
    eliminarItem: (id) => {
        const nuevoCarrito = get().carrito.filter((item) => item.id !== id);
        set({ carrito: nuevoCarrito });
        toast.warning("Item eliminado")
    },
    vaciarCarrito: () => {
        set({carrito: []})
    }
}));
