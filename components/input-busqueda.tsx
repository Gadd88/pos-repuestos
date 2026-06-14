import { Search } from "lucide-react";
import { Input } from "./ui/input";
import React from "react";
import { ProductoType } from "@/lib/types";

type InputBusquedaProps = {
    query: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPending: boolean;
    filteredProducts: ProductoType[];
    productos: ProductoType[];
    showLength?: boolean;
};

export const InputBusqueda = ({
    query,
    handleInputChange,
    isPending,
    filteredProducts,
    productos,
    showLength,
}: InputBusquedaProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 neo-card">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Busca productos por nombre o categoría..."
                    value={query}
                    onChange={handleInputChange}
                    className={`pl-10 neo-button ${isPending ? "opacity-50" : "opacity-100"}`}
                />
            </div>
            {showLength && (
                <div className="text-sm text-muted-foreground flex items-center my-2 justify-end p-1">
                    {filteredProducts.length} de {productos.length} productos
                </div>
            )}
        </div>
    );
};
