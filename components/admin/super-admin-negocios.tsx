"use client";

import { Button } from "@/components/ui/button";
import { useNegocioStore } from "@/lib/stores/negocios-store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    UserCheck2,
    UserMinus2,
    CheckCircle,
    XCircle
} from "lucide-react";

export function SuperAdminTabla() {
    const { negocios, isLoading, activarNegocio, listarNegocios } =
        useNegocioStore(
            useShallow((state) => ({
                negocios: state.negocios,
                isLoading: state.isLoading,
                activarNegocio: state.activarNegocio,
                listarNegocios: state.listarNegocios,
            })),
        );

    useEffect(() => {
        listarNegocios();
    }, []);

    if (isLoading) return <p>Cargando...</p>;

    return (
            
             <Table
                        className="px-4 py-3 bg-primary text-primary uppercase border-4 overflow-auto11"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white font-bold border-e-2">
                                    Negocio
                                </TableHead>
                                <TableHead className="text-white font-bold border-e-2">
                                    Estado
                                </TableHead>
                                <TableHead className="text-white font-bold">
                                    Acción
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {negocios.map((negocio) => (
                                <TableRow
                                    key={negocio.id}
                                    className="text-sm text-black font-semibold bg-secondary-foreground"
                                >
                                    <TableCell className="border-e-2">
                                        {negocio.nombre}
                                    </TableCell>
                                    <TableCell className="uppercase font-black text-center border-e-2">
                                        {negocio.activo ? <CheckCircle className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={`neo-button p-2 font-black ${negocio.activo ? "bg-red-500 text-white" : "bg-lime-600 text-white"} cursor-pointer w-full md:w-1/2`}
                                            onClick={() => activarNegocio(negocio)}
                                        >
                                            {negocio.activo ? <UserMinus2 className="w-4 h-4" /> : <UserCheck2 className="w-4 h-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
        
    );
}
