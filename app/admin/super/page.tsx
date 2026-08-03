import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SuperAdminTabla } from "@/components/admin/super-admin-negocios";
import { AdminHeader } from "@/components/admin/admin-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function SuperAdminPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) redirect("/login");

    const sessionData = JSON.parse(session.value);

    if (!sessionData?.esSuperAdmin) {
        redirect("/admin");
    }

    return (
        <div className="container p-6 space-y-6 mx-auto">
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
                            ADMINISTRADOR DE NEGOCIOS
                        </h1>
                        <p className="text-muted-foreground">
                            Habilita o Deshabilita los negocios registrados
                        </p>
                    </div>
                </div>

            <SuperAdminTabla />
        </div>
    );
}
