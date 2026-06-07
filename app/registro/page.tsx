import { RegisterForm } from "@/components/register-form";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function RegisterPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (session) redirect("/admin");

    return (
        <div className="container flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <h1
                        className="neo-heading text-4xl"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        Crea tu cuenta
                    </h1>
                    <p className="text-muted-foreground">
                        Registrá tu negocio para comenzar
                    </p>
                </div>
                <RegisterForm />
            </div>
            <p className="text-muted-foreground text-sm my-4">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="neo-card p-1 font-semibold text-primary hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}
