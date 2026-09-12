import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InconsistenciaStock } from "@/lib/types";
import { corregirStock } from "@/services/movimientos-stock.services";
import React, { Dispatch, SetStateAction, useState } from "react";

interface ModalCorrecionI {
    productoAcorregir: InconsistenciaStock;
    tipoValidacion: string | null;
    stockCorrecto: string;
    motivoCorreccion: string;
    errorCorreccion: string | null;
    setStockCorrecto: Dispatch<SetStateAction<string>>;
    setMotivoCorreccion: Dispatch<SetStateAction<string>>;
    setErrorCorreccion: Dispatch<SetStateAction<string | null>>;
    validarStock: () => void;
    validarProductoStock: () => void;
    setProductoAcorregir: Dispatch<SetStateAction<InconsistenciaStock | null>>;
}

export const ModalCorreccionStock = ({
    productoAcorregir,
    tipoValidacion,
    stockCorrecto,
    motivoCorreccion,
    errorCorreccion,
    validarStock,
    validarProductoStock,
    setProductoAcorregir,
    setStockCorrecto,
    setMotivoCorreccion,
    setErrorCorreccion,
}: ModalCorrecionI) => {
    const [isCorrigiendoStock, setIsCorrigiendoStock] = useState(false);

    const handleCorregirStock = async () => {
        if (!productoAcorregir) {
            return;
        }

        const stock = Number(stockCorrecto);

        if (!Number.isFinite(stock) || stock < 0) {
            setErrorCorreccion("Ingresá un stock válido mayor o igual a 0.");
            return;
        }

        if (!motivoCorreccion.trim()) {
            setErrorCorreccion("Ingresá el motivo de la corrección.");
            return;
        }

        try {
            setIsCorrigiendoStock(true);
            setErrorCorreccion(null);

            await corregirStock({
                productoId: productoAcorregir.productoId,
                stockCorrecto: stock,
                motivo: motivoCorreccion.trim(),
            });

            setProductoAcorregir(null);
            setStockCorrecto("");
            setMotivoCorreccion("");

            if (tipoValidacion === "todo") {
                await validarStock();
            }

            if (tipoValidacion === "producto") {
                await validarProductoStock();
            }
        } catch (error) {
            setErrorCorreccion(
                error instanceof Error
                    ? error.message
                    : "Error al corregir stock",
            );
        } finally {
            setIsCorrigiendoStock(false);
        }
    };
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3">
            <div className="neo-card w-full max-w-md p-4 sm:p-6">
                <h2 className="neo-heading text-lg">CORREGIR STOCK</h2>

                <p className="mt-2 text-sm">Producto:</p>

                <p className="font-bold">{productoAcorregir.productoNombre}</p>

                <div className="mt-4 border-2 border-black p-3">
                    {/* <p className="text-xs font-semibold text-gray-600">
                        STOCK ACTUAL REGISTRADO
                    </p>

                    <p className="text-2xl font-bold">
                        {productoAcorregir.stockAnteriorRegistrado}
                    </p> */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="border-2 border-black p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                ÚLTIMO STOCK AUDITADO
                            </p>

                            <p className="text-2xl font-bold">
                                {productoAcorregir.stockUltimoMovimiento}
                            </p>
                        </div>

                        <div className="border-2 border-black p-3">
                            <p className="text-xs font-semibold text-gray-600">
                                STOCK ACTUAL
                            </p>

                            <p className="text-2xl font-bold">
                                {productoAcorregir.stockActual}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 border-2 border-black p-3">
                        <p className="text-xs font-semibold text-gray-600">
                            DIFERENCIA
                        </p>

                        <p className="text-2xl font-bold">
                            {(productoAcorregir.stockUltimoMovimiento ?? 0) -
                                (productoAcorregir.stockActual ?? 0)}
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <Label className="text-sm font-semibold">
                        STOCK CORRECTO
                    </Label>

                    <Input
                        type="number"
                        min="0"
                        value={stockCorrecto}
                        onChange={(e) => setStockCorrecto(e.target.value)}
                        className="neo-input mt-1 w-full"
                        placeholder="Ej: 15"
                    />
                </div>

                <div className="mt-4">
                    <Label className="text-sm font-semibold">MOTIVO</Label>

                    <Textarea
                        value={motivoCorreccion}
                        onChange={(e) => setMotivoCorreccion(e.target.value)}
                        className="neo-input mt-1 min-h-24 w-full resize-y"
                        placeholder="Ej: Conteo físico de stock"
                    />
                </div>

                {errorCorreccion && (
                    <div className="mt-3 border-2 border-black bg-red-100 p-3 text-sm">
                        {errorCorreccion}
                    </div>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                            if (isCorrigiendoStock) {
                                return;
                            }

                            setProductoAcorregir(null);
                            setStockCorrecto("");
                            setMotivoCorreccion("");
                            setErrorCorreccion(null);
                        }}
                        className="neo-button w-full sm:w-auto"
                        disabled={isCorrigiendoStock}
                    >
                        CANCELAR
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCorregirStock}
                        className="neo-button w-full sm:w-auto bg-black text-white font-semibold hover:bg-black/80 hover:text-white"
                        disabled={isCorrigiendoStock}
                    >
                        {isCorrigiendoStock
                            ? "CORRIGIENDO..."
                            : "CONFIRMAR CORRECCIÓN"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
