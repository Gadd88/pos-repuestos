import { AdminHeader } from "@/components/admin/admin-header";
import { VentasTable } from "@/components/ventas/venta-table";
import { Loader2 } from "lucide-react";

export default function VentasPage() {

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1
                                className="neo-heading text-4xl mb-2"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                HISTÓRICO DE VENTAS
                            </h1>
                            <p className="text-muted-foreground">
                                Listado de ventas realizadas
                            </p>
                        </div>
                    </div>
                    <VentasTable />
                </div>
            </main>
        </div>
    );
}
