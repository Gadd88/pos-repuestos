import { useListarProductos } from "@/features/productos/useProductos";
import { useDebounce } from "@/hooks/useDebounce";
import { useMemo, useState } from "react";

export const useBusquedaProductos = () => {
  const { data: productos = [], isLoading, error } = useListarProductos();

  const [query, setQuery] = useState("");

  // ⏳ debounce (ej: 300ms)
  const debouncedQuery = useDebounce(query, 300);

  // 🧠 memoización
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return productos;

    const lower = debouncedQuery.toLowerCase();

    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(lower)
    );
  }, [debouncedQuery, productos]);

  return {
    query,
    setQuery,
    productos,
    error,
    filteredProducts,
    isLoading,
  };
};