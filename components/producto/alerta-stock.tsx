import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ProductoType } from "@/lib/types";

export const AlertaStock = (productosBajoStock: ProductoType[]) => {
    return (
        <div className="neo-card p-6 space-y-4">
            <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <h2
                    className="neo-heading text-xl"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    Alertas de Bajo Stock
                </h2>
            </div>
            <p className="text-muted-foreground">
                {productosBajoStock.length > 0
                    ? `${productosBajoStock.length} productos necesitan re-stock`
                    : "Todos los productos en stock"}
            </p>
            <Link href="/admin/stock">
                <Button
                    variant="outline"
                    className="w-full neo-button font-bold bg-transparent"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                >
                    Ver Alertas
                </Button>
            </Link>
        </div>
    );
};
