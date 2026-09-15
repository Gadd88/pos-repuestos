"use client";
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
import { UsuarioType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

type UsuariosTablaType = {
    usuarios: UsuarioType[]
    seleccionarUsuario: Dispatch<SetStateAction<UsuarioType | null>>
}

export function UsuariosTabla({ usuarios, seleccionarUsuario }: UsuariosTablaType) {
    // const { usuarios, eliminarVendedor, obtenerUsuarios } = useUsuarioStore();

    const handleDelete = async (usuario: UsuarioType) => {
        seleccionarUsuario(usuario)
        // await eliminarUsuario(id)
        // await eliminarVendedor(id);
        // await obtenerUsuarios();
    }

    return (
        <div className="neo-card overflow-auto">
            <Table
                className="px-4 py-3 uppercase"
                style={{ fontFamily: "var(--font-montserrat)" }}
            >
                <TableHeader className="bg-black">
                    <TableRow>
                        <TableHead className="text-white font-bold border-e-2">
                            Nombre
                        </TableHead>
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
                            <TableCell>{usuario?.nombreUsuario}</TableCell>
                            <TableCell>{usuario?.email}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(usuario)}
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
