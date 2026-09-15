"use client";

import { useState } from "react";
import { useUsuarioStore } from "@/lib/stores/usuarios-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Check, Circle } from "lucide-react";

export function UsuarioNuevoModal({ onClose }: { onClose: () => void }) {
    const { generarVendedor, error } = useUsuarioStore();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error(
                "La contraseña debe contener al menos una letra mayúscula",
            );
            return;
        }
        if (!/[a-z]/.test(password)) {
            toast.error(
                "La contraseña debe contener al menos una letra minúscula",
            );
            return;
        }
        if (!/[0-9]/.test(password)) {
            toast.error("La contraseña debe contener al menos un número");
            return;
        }
        setLoading(true);
        await generarVendedor(nombre, email, password);
        // await obtenerUsuarios();
        setLoading(false);
        onClose();
        
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-lg space-y-4 w-full max-w-md">
                <h2 className="text-xl font-bold">Generar Vendedor</h2>

                <div>
                    <Input
                        type="text"
                        className="border-2 bg-white rounded-md shadow-sm"
                        placeholder="Nombre del vendedor"
                        value={nombre.trim()}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        type="email"
                        className="border-2 bg-white rounded-md shadow-sm"
                        placeholder="Email del vendedor"
                        value={email.trim()}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        placeholder="Contraseña"
                        className="border-2 bg-white rounded-md shadow-sm"
                        type="password"
                        value={password.trim()}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <ul className="text-xs border p-2 mt-2 rounded-md text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                            <Circle className="size-2" />
                            El password debe tener al menos 6 caracteres
                        </li>
                        <li className="flex items-center gap-2">
                            <Circle className="size-2" />
                            Debe contener al menos una letra mayúscula
                        </li>
                        <li className="flex items-center gap-2">
                            <Circle className="size-2" />
                            Debe contener al menos una letra minúscula
                        </li>
                        <li className="flex items-center gap-2">
                            <Circle className="size-2" />
                            Debe contener al menos un número
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-2 justify-around gap-2">
                    <Button variant="outline" onClick={onClose} className="font-semibold cursor-pointer">
                        Cancelar
                    </Button>
                    <Button
                        className="bg-black text-white font-semibold hover:bg-gray-700 hover:border-black cursor-pointer "
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Generando..." : "Generar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
