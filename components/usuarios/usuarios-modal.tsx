"use client";

import { useState } from "react";
import { useUsuarioStore } from "@/lib/stores/usuarios-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function UsuarioNuevoModal({ onClose }: { onClose: () => void }) {
  const { generarVendedor, obtenerUsuarios  } = useUsuarioStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await generarVendedor(email, password)
        // await obtenerUsuarios();
        setLoading(false);
        onClose();
    } catch (error) {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg space-y-4 w-full max-w-md">
        <h2 className="text-xl font-bold">Generar Vendedor</h2>

        <Input
          placeholder="Email del vendedor"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generando..." : "Generar"}
          </Button>
        </div>
      </div>
    </div>
  );
}