"use client";
import { Trash2, CircleX, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { useCarritoState } from "@/lib/stores/carrito-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGenerarVenta } from "@/features/ventas/useVentas";
import { useGenerarPresupuesto } from "@/features/presupuestos/usePresupuesto";

export const Carrito = () => {
    const {
        carrito,
        eliminarItem,
        editarCantidad,
        vaciarCarrito,
        isOpen,
        setIsOpen,
    } = useCarritoState();
    const {
        mutateAsync: generarVenta,
        isPending: isLoading,
        error: errorVenta,
    } = useGenerarVenta();

    const {
        mutateAsync: generarPresupuesto,
        isPending,
        error: errorPresupuesto,
    } = useGenerarPresupuesto();
    const [esMayorista, setEsMayorista] = useState(false);

    const queryClient = useQueryClient();

    const totalVenta = carrito.reduce(
        (acc, item) =>
            acc +
            (esMayorista
                ? item.precio_venta_mayorista
                : item.precio_venta_minorista) *
                item.cantidad,
        0,
    );

    const totalProductos = carrito.reduce(
        (acc, item) => acc + item.cantidad,
        0,
    );

    const handleVaciar = () => {
        vaciarCarrito();
        setIsOpen(false);
    };

    const handleVenta = async () => {
        await generarVenta({
            carrito,
            tipo_venta: esMayorista ? "mayorista" : "minorista",
        });
        toast.success("Venta creada correctamente", {
            style: {
                background: "paleturquoise",
                font: "bold",
            },
        });
        queryClient.invalidateQueries({ queryKey: ["productos"] });
        queryClient.invalidateQueries({ queryKey: ["ventas"] });
        vaciarCarrito();
        setIsOpen(false);
    };
    const handlePresupuesto = async () => {
        const nueva_venta = await generarPresupuesto({
            carrito,
            tipo_venta: esMayorista ? "mayorista" : "minorista",
        });
        console.log(nueva_venta)
        const link = `${window.location.origin}/presupuesto/${nueva_venta.idVentas}`;
        const mensaje = `🧾 Presupuesto
        
        Hola! Te comparto el Presupuesto
        Total: $${nueva_venta.total}

        Ver detalle:
        ${link}
        `;
        await navigator.clipboard.writeText(mensaje);
        toast.success(
            "Presupuesto creado correctamente y copiado al portapapeles",
            {
                style: {
                    background: "paleturquoise",
                    font: "bold",
                },
            },
        );
        queryClient.invalidateQueries({ queryKey: ["ventas"] });
        vaciarCarrito();
        setIsOpen(false);
    };

    const handleActive = () => {
        if (!carrito.length) return null;
        setIsOpen(true);
    };

    return (
        <section className="fixed right-5 bottom-20 z-50">
            {!isOpen && (
                <Button
                    className="neo-button relative flex items-center justify-center w-11 h-11 me-3 bg-primary text-primary-foreground hover:shadow-[6px_6px_0px_0px_theme(--color-border)] transition-all duration-200"
                    onClick={handleActive}
                >
                    <ShoppingCart className="w-8 h-8" />
                    {carrito.length > 0 && (
                        <span
                            className="absolute -top-2 -right-2 neo-button w-6 h-6 flex items-center justify-center bg-white text-black text-xs font-bold"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            {carrito.length}
                        </span>
                    )}
                </Button>
            )}
            {isOpen
                ? createPortal(
                      <>
                          <div className="fixed inset-0 bg-black/50 z-40">
                              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-lg max-h-[80dvh] flex flex-col neo-card bg-background shadow-[8px_8px_0px_0px_theme(--color-border)]">
                                  <div className="flex items-center justify-between p-4 border-b-2 border-border bg-black shrink-0">
                                      <h2
                                          className="neo-heading text-xl text-primary-foreground"
                                          style={{
                                              fontFamily:
                                                  "var(--font-montserrat)",
                                          }}
                                      >
                                          CREAR VENTA
                                      </h2>
                                      <button
                                          onClick={() => setIsOpen(false)}
                                          className="neo-button w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                                      >
                                          <X className="w-4 h-4" />
                                      </button>
                                  </div>

                                  {/* Cart Section */}
                                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                      {carrito.length === 0 ? (
                                          <p className="text-center text-muted-foreground py-8">
                                              El carrito está vacío
                                          </p>
                                      ) : (
                                          carrito.map((item) => (
                                              <div
                                                  key={item.id}
                                                  className="neo-card flex items-center justify-between gap-3 p-3 bg-card"
                                              >
                                                  {/* Nombre */}
                                                  <h3
                                                      className="flex-1 font-bold text-sm truncate"
                                                      style={{
                                                          fontFamily:
                                                              "var(--font-montserrat)",
                                                      }}
                                                  >
                                                      {item.nombre}
                                                  </h3>

                                                  {/* Controles de cantidad */}
                                                  <div className="flex items-center border-2 border-border shrink-0">
                                                      <button
                                                          onClick={() =>
                                                              editarCantidad(
                                                                  item.id,
                                                                  item.cantidad -
                                                                      1,
                                                              )
                                                          }
                                                          className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-muted transition-colors border-r-2 border-border"
                                                      >
                                                          −
                                                      </button>
                                                      <span
                                                          className="w-8 h-8 flex items-center justify-center font-bold text-sm"
                                                          style={{
                                                              fontFamily:
                                                                  "var(--font-montserrat)",
                                                          }}
                                                      >
                                                          {item.cantidad}
                                                      </span>
                                                      <button
                                                          onClick={() =>
                                                              editarCantidad(
                                                                  item.id,
                                                                  item.cantidad +
                                                                      1,
                                                              )
                                                          }
                                                          className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-muted transition-colors border-l-2 border-border"
                                                      >
                                                          +
                                                      </button>
                                                  </div>

                                                  {/* Eliminar */}
                                                  <button
                                                      onClick={() => {
                                                          eliminarItem(item.id);
                                                          toast(
                                                              "Producto eliminado",
                                                              {
                                                                  className:
                                                                      "!bg-red-300 !font-bold",
                                                                  icon: (
                                                                      <CircleX />
                                                                  ),
                                                              },
                                                          );
                                                      }}
                                                      className="neo-button w-8 h-8 flex items-center justify-center bg-destructive text-destructive-foreground hover:shadow-[3px_3px_0px_0px_theme(colors.border)] transition-all shrink-0"
                                                  >
                                                      <Trash2 className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          ))
                                      )}
                                  </div>

                                  {/* Footer con totales y botón */}
                                  <div className="shrink-0 border-t-2 border-border p-4 space-y-3 bg-card">
                                      <div className="flex justify-between items-center text-sm">
                                          <span
                                              className="font-bold uppercase text-muted-foreground"
                                              style={{
                                                  fontFamily:
                                                      "var(--font-montserrat)",
                                              }}
                                          >
                                              Productos
                                          </span>
                                          <span className="font-bold">
                                              {totalProductos}
                                          </span>
                                      </div>

                                      <div className="flex justify-between items-center border-t-2 border-border pt-3">
                                          <div className="neo-button flex gap-2 items-center justify-between p-2 bg-transparent shrink-0">
                                              <label
                                                  className="cursor-pointer uppercase neo-heading"
                                                  htmlFor="esMayorista"
                                              >
                                                  Mayorista
                                              </label>
                                              <input
                                                  id="esMayorista"
                                                  name="esMayorista"
                                                  type="checkbox"
                                                  checked={esMayorista}
                                                  onChange={(e) =>
                                                      setEsMayorista(
                                                          e.target.checked,
                                                      )
                                                  }
                                              />
                                          </div>
                                          <div className="flex flex-col items-center w-full">
                                              <span
                                                  className="neo-heading text-lg"
                                                  style={{
                                                      fontFamily:
                                                          "var(--font-montserrat)",
                                                  }}
                                              >
                                                  TOTAL
                                              </span>
                                              <span
                                                  className="neo-heading text-xl"
                                                  style={{
                                                      fontFamily:
                                                          "var(--font-montserrat)",
                                                  }}
                                              >
                                                  $
                                                  {totalVenta.toLocaleString(
                                                      "es-AR",
                                                  )}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                          <button
                                              onClick={handleVenta}
                                              disabled={
                                                  isLoading ||
                                                  isPending ||
                                                  carrito.length === 0
                                              }
                                              className="neo-button w-full py-1 font-bold text-sm bg-blue-400 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_theme(colors.border)] transition-all"
                                              style={{
                                                  fontFamily:
                                                      "var(--font-montserrat)",
                                              }}
                                          >
                                              {isLoading
                                                  ? "GENERANDO VENTA..."
                                                  : "CONFIRMAR VENTA"}
                                          </button>
                                          <button
                                              onClick={handlePresupuesto}
                                              disabled={
                                                  isLoading ||
                                                  isPending ||
                                                  carrito.length === 0
                                              }
                                              className="neo-button w-full py-1 font-bold text-sm bg-lime-400 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_theme(colors.border)] transition-all"
                                              style={{
                                                  fontFamily:
                                                      "var(--font-montserrat)",
                                              }}
                                          >
                                              {isPending
                                                  ? "GENERANDO PRESUPUESTO..."
                                                  : "PRESUPUESTAR"}
                                          </button>
                                      </div>
                                      <div>
                                          <button
                                              onClick={handleVaciar}
                                              className="neo-button w-full py-1 font-bold text-sm bg-secondary-foreground text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_theme(colors.border)] transition-all flex justify-center items-center gap-1"
                                              style={{
                                                  fontFamily:
                                                      "var(--font-montserrat)",
                                              }}
                                          >
                                              <Trash2 />
                                              VACIAR CARRITO
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </>,
                      document.getElementById("modal")!,
                  )
                : null}
        </section>
    );
};
