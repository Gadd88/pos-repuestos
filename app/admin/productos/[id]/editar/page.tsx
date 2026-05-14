import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/producto/product-form";
import { obtenerProductoPorId } from "@/services/productos-services";
import { useProductosStore } from "@/lib/stores/products-store";
import { redirect } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{id: string}>;
}
export const dynamic = "force-dynamic";

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;
    
    // console.log(id)
    
    const producto = await obtenerProductoPorId(id)

    // console.log(producto)
    // if(!id || !producto) redirect('/admin/stock')

    return <>
    <AdminHeader />
    <ProductForm productoId={id} productoData={producto} />;
    </>
}
