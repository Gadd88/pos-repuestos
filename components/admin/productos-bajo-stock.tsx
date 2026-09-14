import { ProductoType } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";

interface ProductosBajoStockI {
    productosBajoStock: ProductoType[]
}

export const ProductosBajoStock = ({ productosBajoStock }: ProductosBajoStockI) => {
    return (
        <div className="neo-card p-4 space-y-4 max-h-64">
            <div className="flex items-center gap-3 cursor-default">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <h2
                    className="neo-heading text-xl"
                    style={{
                        fontFamily: "var(--font-montserrat)",
                    }}
                >
                    Productos con Bajo Stock
                </h2>
            </div>

            {productosBajoStock.length > 0 ? (
                <ul className="text-sm text-muted-foreground mb-4 overflow-auto flex flex-wrap gap-1 max-h-60">
                    {productosBajoStock.map((prod) => (
                        <li key={prod.id} className="font-semibold cursor-default">
                            <Badge
                                variant="secondary"
                                className="bg-yellow-400 text-black border-black"
                            >
                                {prod.nombre} - {prod.stock}u.
                            </Badge>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">
                    Todos los productos con stock mínimo o suficiente.
                </p>
            )}
        </div>
    );
};
