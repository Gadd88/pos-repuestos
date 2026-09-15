import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResumenCajaPage() {
    // <if (isLoading) {
    //     return (
    //         <div className="container mx-auto px-4 py-8">
    //             <div className="flex items-center justify-center py-12">
    //                 <div className="text-center space-y-4">
    //                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
    //                     <p className="text-muted-foreground">
    //                         Cargando inventario...
    //                     </p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

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
                            RESUMEN DE CAJA DIARIO
                        </h1>
                        <p className="text-muted-foreground">
                            Resumen detallado de las ventas diarias realizadas.
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-center italic flex items-center justify-center h-full">
                ESTA FUNCIONALIDAD AUN NO ESTÁ OPERATIVA
            </div>
        </div>
    );
}
