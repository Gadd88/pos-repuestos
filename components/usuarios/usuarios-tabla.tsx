"use client";
import { useUsuarioStore } from "@/lib/stores/usuarios-store";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export function UsuariosTabla() {
    const { usuarios, eliminarVendedor, obtenerUsuarios } = useUsuarioStore();

    const handleDelete = async (id: string) => {
        await eliminarVendedor(id);
        await obtenerUsuarios();
    }

    return (
        <div className="neo-card overflow-auto">
            <Table
                className="px-4 py-3 uppercase"
                style={{ fontFamily: "var(--font-montserrat)" }}
            >
                <TableHeader className="bg-purple-500">
                    <TableRow>
                        <TableHead className="text-white font-bold border-e-2">
                            Email
                        </TableHead>

                        <TableHead className="text-white font-bold">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios?.map((usuario) => (
                        <TableRow key={usuario?.id ?? usuario?.uid}>
                            <TableCell>{usuario?.email}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(usuario.id ?? usuario.uid)}
                                    className="neo-button font-semibold"
                                    style={{
                                        fontFamily: "var(--font-montserrat)",
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
