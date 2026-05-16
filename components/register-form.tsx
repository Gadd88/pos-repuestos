"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const data = {
            nombreNegocio: formData.get("negocioNombre"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const res = await fetch("/api/auth/registrar-nuevo-admin", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Error al registrarse");

            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error("Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Nombre de negocio</Label>
                <Input name="negocioNombre" placeholder="Mi negocio" required />
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    name="email"
                    type="email"
                    placeholder="email@ejemplo.com"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" required />
            </div>

            <Button
                type="submit"
                className="w-full neo-button font-semibold"
                disabled={loading}
            >
                {loading ? "Creando cuenta..." : "REGISTRARSE"}
            </Button>
        </form>
    );
}
