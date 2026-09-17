import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle, CircleX, ReceiptText, Trash2 } from "lucide-react";
import { ItemCarrito } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface ContenidoCarritoProps {
    carrito: ItemCarrito[];
    totalProductos: number;
    totalVenta: number;
    esMayorista: boolean;
    metodoPago: string;
    isLoading: boolean;
    isPending: boolean;
    eliminarItem: (id: string) => void;
    editarCantidad: (id: string, cantidad: number) => void;
    vaciarCarrito: () => void;
    setEsMayorista: Dispatch<SetStateAction<boolean>>;
    setMetodoPago: Dispatch<SetStateAction<string>>;
    handleVaciar: () => void;
    handleVenta: () => Promise<void>;
    handlePresupuesto: () => Promise<void>;
}

export const ContenidoCarrito = ({
    carrito,
    eliminarItem,
    editarCantidad,
    totalProductos,
    totalVenta,
    esMayorista,
    setEsMayorista,
    metodoPago,
    setMetodoPago,
    handleVenta,
    handlePresupuesto,
    handleVaciar,
    isLoading,
    isPending,
}: ContenidoCarritoProps) => {
    return (
        <>
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
                                    fontFamily: "var(--font-montserrat)",
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
                                            item.cantidad - 1,
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-muted transition-colors border-r-2 border-border"
                                >
                                    −
                                </button>
                                <span
                                    className="w-8 h-8 flex items-center justify-center font-bold text-sm"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    {item.cantidad}
                                </span>
                                <button
                                    onClick={() =>
                                        editarCantidad(
                                            item.id,
                                            item.cantidad + 1,
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
                                    toast("Producto eliminado", {
                                        className: "!bg-red-300 !font-bold",
                                        icon: <CircleX />,
                                    });
                                }}
                                className="neo-button w-8 h-8 flex items-center justify-center bg-destructive text-destructive-foreground hover:shadow-[3px_3px_0px_0px_theme(--color-border)] transition-all shrink-0"
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
                            fontFamily: "var(--font-montserrat)",
                        }}
                    >
                        Productos
                    </span>
                    <span className="font-bold">{totalProductos}</span>
                </div>

                <div className="rounded-xl p-2 border-t-2">
                    <h3 className="neo-heading text-center my-2">
                        Método de pago
                    </h3>
                    <RadioGroup
                        defaultValue="efectivo"
                        value={metodoPago}
                        name="Método de pago"
                        onValueChange={setMetodoPago}
                        className="grid grid-cols-4 overflow-x-auto  items-center"
                    >
                        <div className="flex justify-between p-2 md:border-b-2 md:border-e-2 flex-col-reverse items-center rounded-xl gap-2 md:shadow-md md:p-2">
                            <Label
                                className="neo-heading font-semibold md:text-md"
                                htmlFor="efectivo"
                            >
                                Efectivo
                            </Label>
                            <RadioGroupItem
                                value="efectivo"
                                defaultChecked={true}
                                id="efectivo"
                                className="border-2 border-muted rounded-full w-6 h-6 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                Efectivo
                            </RadioGroupItem>
                        </div>
                        <div className="flex justify-between p-2 md:border-b-2 md:border-e-2 flex-col-reverse items-center rounded-xl gap-2 md:shadow-md md:p-2">
                            <Label
                                className="neo-heading font-semibold md:text-md"
                                htmlFor="transferencia"
                            >
                                Transferencia
                            </Label>
                            <RadioGroupItem
                                value="transferencia"
                                id="transferencia"
                                className="border-2 border-muted rounded-full w-6 h-6 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                Transferencia
                            </RadioGroupItem>
                        </div>
                        <div className="flex justify-between p-2 md:border-b-2 md:border-e-2 flex-col-reverse items-center rounded-xl gap-2 md:shadow-md md:p-2">
                            <Label
                                className="neo-heading font-semibold md:text-md"
                                htmlFor="tarjeta"
                            >
                                Tarjeta
                            </Label>
                            <RadioGroupItem
                                value="tarjeta"
                                id="tarjeta"
                                className="border-2 border-muted rounded-full w-6 h-6 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                Tarjeta
                            </RadioGroupItem>
                        </div>
                        <div className="flex justify-between p-2 md:border-b-2 md:border-e-2 flex-col-reverse items-center rounded-xl gap-2 md:shadow-md md:p-2">
                            <Label
                                className="neo-heading font-semibold md:text-md"
                                htmlFor="qr"
                            >
                                QR
                            </Label>
                            <RadioGroupItem
                                value="qr"
                                id="qr"
                                className="border-2 border-muted rounded-full w-6 h-6 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                QR
                            </RadioGroupItem>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex justify-between items-center border-t-2 pt-3">
                    <div className="neo-button flex gap-2 items-center justify-between p-1 bg-transparent shrink-0 border-b-2 border-e-2 border-black">
                        <Label
                            className="cursor-pointer uppercase neo-heading font-semibold"
                            htmlFor="esMayorista"
                        >
                            Mayorista
                        </Label>
                        <Input
                            id="esMayorista"
                            name="esMayorista"
                            type="checkbox"
                            checked={esMayorista}
                            onChange={(e) => setEsMayorista(e.target.checked)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 flex-wrap items-center w-full">
                        <span
                            className="neo-heading text-lg"
                            style={{
                                fontFamily: "var(--font-montserrat)",
                            }}
                        >
                            TOTAL
                        </span>
                        <span
                            className="neo-heading text-xl"
                            style={{
                                fontFamily: "var(--font-montserrat)",
                            }}
                        >
                            ${totalVenta.toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button
                        onClick={handleVenta}
                        disabled={
                            isLoading || isPending || carrito.length === 0
                        }
                        className="neo-button w-full py-1 font-bold text-sm bg-blue-500 hover:bg-blue-400 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_theme(--color-border)] transition-all"
                        style={{
                            fontFamily: "var(--font-montserrat)",
                        }}
                    >
                        {isLoading ? (
                            "GENERANDO VENTA..."
                        ) : (
                            <span className="flex items-center gap-2 justify-center overflow-hidden">
                                <CheckCircle className="size-6" />{" "}
                                CONFIRMAR VENTA
                            </span>
                        )}
                    </Button>
                    <Button
                        onClick={handlePresupuesto}
                        disabled={
                            isLoading || isPending || carrito.length === 0
                        }
                        className="neo-button w-full py-1 font-bold text-sm bg-lime-500 hover:bg-lime-400 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_theme(--color-border)] transition-all"
                        style={{
                            fontFamily: "var(--font-montserrat)",
                        }}
                    >
                        {isPending ? (
                            "GENERANDO PRESUPUESTO..."
                        ) : (
                            <span className="flex items-center gap-2 justify-center overflow-hidden">
                                <ReceiptText className="size-6" />
                                PRESUPUESTAR
                            </span>
                        )}
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={handleVaciar}
                        disabled={!carrito.length}
                        className="neo-button w-full border-2 py-1 font-bold text-sm bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[4px_4px_0px_0px_var(--color-border)] transition-all flex justify-center items-center gap-1 hover:bg-accent"
                        style={{
                            fontFamily: "var(--font-montserrat)",
                        }}
                    >
                        <Trash2 />
                        VACIAR CARRITO
                    </Button>
                </div>
            </div>
        </>
    );
};
