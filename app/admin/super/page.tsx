import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SuperAdminTabla } from "@/components/admin/super-admin-negocios";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function SuperAdminPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) redirect("/login");

    const sessionData = JSON.parse(session.value);

    if (!sessionData?.esSuperAdmin) {
        redirect("/admin");
    }

    return (
        <>
            <AdminHeader />
            <main>
                <div className="p-6 space-y-6">
                    <p className="text-muted-foreground">
                        Gestión de negocios registrados
                    </p>

                    <SuperAdminTabla />
                </div>
            </main>
        </>
    );
}
