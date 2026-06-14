import Link from "next/link";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { ProductoType } from "@/lib/types";
import { useAuthStore } from "@/lib/stores/auth-store";

type ProductCardStockType = {
    producto: ProductoType;
    onDelete: (producto: ProductoType) => void;
};

export const ProductCardStock = ({
    producto,
    onDelete,
}: ProductCardStockType) => {
    const { usuario } = useAuthStore();

    return (
        <div className="neo-card p-4 bg-background">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                            <h3
                                className="neo-heading text-lg"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                {producto.nombre}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="neo-subheading">
                                {producto.stock <= 2 && producto.stock > 0 ? (
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-400 text-black"
                                    >
                                        BAJO STOCK
                                    </Badge>
                                ) : producto.stock === 0 ? (
                                    <Badge variant="destructive">
                                        SIN STOCK
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="bg-sky-700 text-white"
                                    >
                                        EN STOCK
                                    </Badge>
                                )}
                            </span>
                            <div
                                className="neo-heading text-xl"
                                style={{
                                    fontFamily: "var(--font-montserrat)",
                                }}
                            >
                                {producto.stock}un.
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-xs text-muted-foreground">
                                    Precio Minorista
                                </span>
                                <div
                                    className="neo-heading text-xl text-primary"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    ${producto.precio_venta_minorista}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">
                                    Precio Mayorista
                                </span>
                                <div
                                    className="neo-heading text-xl text-secondary"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    ${producto.precio_venta_mayorista}
                                </div>
                            </div>
                        </div>

                        {(usuario?.rol === "admin" ||
                            usuario?.rol === "superadmin") && (
                            <div className="flex items-center justify-between gap-2">
                                <Link
                                    href={`/admin/productos/${producto.id}/editar-producto`}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="neo-button font-semibold bg-transparent"
                                        style={{
                                            fontFamily:
                                                "var(--font-montserrat)",
                                        }}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        EDITAR
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(producto)}
                                    className="neo-button font-semibold"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    ELIMINAR
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
