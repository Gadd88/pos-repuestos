import { Button } from "@/components/ui/button";
import { VentasTable } from "@/components/ventas/venta-table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VentasPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="neo-button font-semibold bg-transparent"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            VOLVER AL DASHBOARD
                        </Button>
                    </Link>
                    <div className="ms-auto">
                        <h1
                            className="neo-heading text-4xl"
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
        </div>
    );
}
