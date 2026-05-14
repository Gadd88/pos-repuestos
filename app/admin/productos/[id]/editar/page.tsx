import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/producto/product-form";
import { getProductoById } from "@/lib/db/productos";

interface EditProductPageProps {
    params: Promise<{id: string}>;
}
export const dynamic = "force-dynamic";

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;
    const producto = await getProductoById(id)

    // console.log(producto)
    if(!producto) return <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Producto no encontrado
                </h1>
                <p className="text-gray-600">El producto que intentas editar no existe.</p>
            </div>
        </main>
    </div>

    return <>
    <AdminHeader />
    <ProductForm productoId={id} productoData={producto} />;
    </>
}
