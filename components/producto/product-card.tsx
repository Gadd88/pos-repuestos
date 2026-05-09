import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductoType } from "@/lib/types";

interface ProductCardProps {
    producto: ProductoType;
}

export function ProductCard({ producto }: ProductCardProps) {
    const isLowStock = producto.stock <= 2;
    const isOutOfStock = producto.stock === 0;

    return (
        
        <div className="neo-card flex flex-col sm:flex-row items-stretch hover:shadow-[6px_6px_0px_0px_theme(--colors-border)] transition-all duration-200 overflow-hidden">
            {/* Contenido */}
            <div className="flex flex-1 flex-col justify-between p-3 gap-3 min-w-0">
                {/* Nombre + precio */}
                <div className="flex flex-col gap-1 min-w-0">
                    <h3
                        className="neo-heading text-sm leading-tight line-clamp-2"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        {producto.nombre}
                    </h3>
                    <div
                        className="neo-heading text-lg text-primary"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        ${producto.precio_venta_minorista.toFixed(2)}
                    </div>
                </div>

                {/* Badge + botón siempre en la misma fila, sin overflow */}
                <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
                    {isOutOfStock ? (
                        <Badge
                            variant="destructive"
                            className="neo-button text-xs font-bold whitespace-nowrap"
                        >
                            SIN STOCK
                        </Badge>
                    ) : isLowStock ? (
                        <Badge className="neo-button text-xs font-bold bg-yellow-400 text-black border-black whitespace-nowrap">
                            BAJO STOCK
                        </Badge>
                    ) : null}

                    <Button
                        variant={isOutOfStock ? "secondary" : "default"}
                        disabled={isOutOfStock}
                        size="sm"
                        className="neo-button font-bold text-xs whitespace-nowrap ms-auto"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        {isOutOfStock ? "SIN STOCK" : "DETALLES"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
