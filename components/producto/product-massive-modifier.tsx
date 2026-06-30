"use client";

import { useState } from "react";
import { Minus, Percent, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useEditarPrecios } from "@/features/productos/useProductos";

type ProductoModificadorPreciosType = {
    modificarPrecios: boolean;
    onClose: () => void;
};

export const ProductoModificadorPrecios = ({
    modificarPrecios,
    onClose,
}: ProductoModificadorPreciosType) => {
    const { mutateAsync: editarMasivo } = useEditarPrecios()
    const [campo, setCampo] = useState("precio_venta_minorista");
    const [operacion, setOperacion] = useState("aumentar");
    const [tipo, setTipo] = useState("porcentaje");
    const [valor, setValor] = useState(0);

    const handleModificacion = async () => {
        const updates = {
            campo,
            operacion,
            tipo,
            valor
        }
        await editarMasivo(updates)
    }

    return (
        <Dialog open={modificarPrecios} onOpenChange={onClose}>
            <DialogContent className="neo-card sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle
                        className="neo-heading text-xl"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Modificación masiva de precios
                    </DialogTitle>

                    <DialogDescription>
                        La modificación se aplicará a todos los productos del
                        inventario.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">

                    {/* Campo */}
                    <div className="space-y-3">
                        <Label>Selecciona precio a modificar</Label>

                        <RadioGroup
                            value={campo}
                            onValueChange={setCampo}
                            className="mt-2"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="precio_compra"
                                    id="precio_compra"
                                    className="rounded-none border-gray-400 bg-gray-300"
                                />
                                <Label htmlFor="precio_compra">
                                    Precio de compra
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="precio_venta_minorista"
                                    id="precio_minorista"
                                    className="rounded-none border-gray-400 bg-gray-300"
                                />
                                <Label htmlFor="precio_minorista">
                                    Precio venta minorista
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="precio_venta_mayorista"
                                    id="precio_mayorista"
                                    className="rounded-none border-gray-400 bg-gray-300"
                                />
                                <Label htmlFor="precio_mayorista">
                                    Precio venta mayorista
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Operación */}
                    <div className="space-y-3">
                        <Label>Operación</Label>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={
                                    operacion === "aumentar"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setOperacion("aumentar")}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Aumentar
                            </Button>

                            <Button
                                type="button"
                                variant={
                                    operacion === "disminuir"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setOperacion("disminuir")}
                            >
                                <Minus className="mr-2 h-4 w-4" />
                                Disminuir
                            </Button>
                        </div>
                    </div>

                    {/* Tipo */}
                    <div className="space-y-3">
                        <Label>Aplicar por</Label>

                        <RadioGroup
                            value={tipo}
                            onValueChange={setTipo}
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="porcentaje"
                                    id="porcentaje"
                                    className="rounded-none border-gray-400 bg-gray-300"
                                />
                                <Label htmlFor="porcentaje">
                                    Porcentaje (%)
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="monto"
                                    id="monto"
                                    className="rounded-none border-gray-400 bg-gray-300"
                                />
                                <Label htmlFor="monto">
                                    Monto fijo ($)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Valor */}
                    <div className="space-y-2">
                        <Label>
                            {tipo === "porcentaje"
                                ? "Porcentaje"
                                : "Monto"}
                        </Label>

                        <Input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(Number(e.target.value))}
                            placeholder={
                                tipo === "porcentaje"
                                    ? "Ej: 15"
                                    : "Ej: 2500"
                            }
                        />
                    </div>

                    <div className="rounded-md border border-yellow-500 bg-yellow-50 p-3 text-sm text-yellow-900">
                        Esta acción modificará los precios de todos los
                        los productos y no podrá deshacerse.
                    </div>
                </div>

                <DialogFooter className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <Button className="w-full" onClick={handleModificacion}>
                        APLICAR MODIFICACIÓN
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};