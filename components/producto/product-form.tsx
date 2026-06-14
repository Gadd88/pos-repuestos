"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ProductoType } from "@/lib/types";
import { useAgregarProducto, useEditarProducto } from "@/features/productos/useProductos";
import { toast } from "sonner";

interface ProductFormProps {
    productoId?: ProductoType["id"];
    productoData?: Partial<
        Omit<ProductoType, "id" | "creadoEn" | "actualizadoEn">
    >;
}

type FormDataType = {
    nombre: string;
    descripcion?: string;
    precio_compra: number;
    precio_venta_mayorista: number;
    precio_venta_minorista: number;
    stock: number;
};

export function ProductForm({ productoId, productoData }: ProductFormProps) {
    const router = useRouter();
    const { mutateAsync: mutateEditar } = useEditarProducto()
    const { mutateAsync: mutateAgregar } = useAgregarProducto()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<FormDataType>({
        nombre: productoData?.nombre ?? "",
        descripcion: productoData?.descripcion ?? "",
        precio_compra: productoData?.precio_compra ?? 0,
        precio_venta_mayorista: productoData?.precio_venta_mayorista ?? 0,
        precio_venta_minorista: productoData?.precio_venta_minorista ?? 0,
        stock: productoData?.stock ?? 0,
    });

    const isEditing = !!productoId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const productData: Omit<
                ProductoType,
                "id" | "creadoEn" | "actualizadoEn" | "negocioId"
            > = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion?.trim() || "",
                precio_compra: formData.precio_compra,
                precio_venta_mayorista: formData.precio_venta_mayorista,
                precio_venta_minorista: formData.precio_venta_minorista,
                stock: formData.stock,
                activo: true,
            };

            if (isEditing && productoId) {
                await mutateEditar({ id: productoId, updates: productData });
                toast.success("Producto actualizado correctamente", {
                    style: {
                        background: "paleturquoise"
                    }
                })
            } else {
                await mutateAgregar({productData: productData});
                toast.success("Producto agregado correctamente", {
                    style: {
                        background: "lightblue"
                    }
                })
            }
            router.push("/admin/stock");
        } catch (error) {
            console.error("Error guardando el producto:", error);
            setError("Ocurrió un error inesperado.");
            throw error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Link href="/admin/stock">
                        <Button
                            variant="outline"
                            className="neo-button font-semibold bg-transparent"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            VOLVER AL INTENVARIO
                        </Button>
                    </Link>
                    <div>
                        <h1
                            className="neo-heading text-4xl"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            {isEditing
                                ? "EDITAR PRODUCTO"
                                : "AGREGAR NUEVO PRODUCTO"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing
                                ? "Actualizar datos del producto"
                                : "Agrega una nueva pieza al inventario"}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="neo-card p-6 space-y-6"
                >
                    {error && (
                        <div className="neo-card p-3 bg-destructive/10 border-destructive text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                PRODUCTO *
                            </Label>
                            <Input
                                id="name"
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nombre: e.target.value,
                                    })
                                }
                                required
                                className="neo-button"
                                placeholder="Filtro de Aire Honda CBR 150"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="descripcion"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                DESCRIPCIÓN
                            </Label>
                            <Input
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        descripcion: e.target.value,
                                    })
                                }
                                className="neo-button"
                                placeholder="Filtro de Aire Honda CBR 150"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="price"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                PRECIO COMPRA($) *
                            </Label>
                            <Input
                                id="pricebuy"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.precio_compra}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        precio_compra: Number(e.target.value),
                                    })
                                }
                                required
                                className="neo-button"
                                placeholder="$10000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="precio_venta_mayorista"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                PRECIO VENTA MAYORISTA($) *
                            </Label>
                            <Input
                                id="precio_venta_mayorista"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.precio_venta_mayorista}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        precio_venta_mayorista: Number(
                                            e.target.value,
                                        ),
                                    })
                                }
                                required
                                className="neo-button"
                                placeholder="$10000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="precio_venta_minorista"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                PRECIO VENTA MINORISTA($) *
                            </Label>
                            <Input
                                id="precio_venta_minorista"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.precio_venta_minorista}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        precio_venta_minorista: Number(
                                            e.target.value,
                                        ),
                                    })
                                }
                                required
                                className="neo-button"
                                placeholder="$10000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="stock"
                                className="neo-heading text-sm"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                CANTIDAD EN STOCK *
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: Number(e.target.value),
                                    })
                                }
                                required
                                className="neo-button"
                                placeholder="5"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 neo-button font-bold"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading
                                ? "GUARDANDO..."
                                : isEditing
                                  ? "ACTUALIZAR PRODUCTO"
                                  : "AGREGAR PRODUCTO"}
                        </Button>
                        <Link href="/admin/stock" className="flex-1">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full neo-button font-bold bg-transparent"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                CANCELAR
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
