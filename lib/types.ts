export type ProductoType = {
    id: string
    nombre: string
    descripcion: string
    precio_compra: number
    stock: number
    precio_venta_minorista: number
    precio_venta_mayorista: number
    activo: boolean
    negocioId: string
    creadoEn: Date
    actualizadoEn: Date
}

export type ItemVentaType = {
    idProducto: string
    nombre: string
    precio_unitario: number
    cantidad: number
}

export type VentaType = {
    id: string
    idVentas?: string
    items: ItemVentaType[]
    total: number
    totalGastado: number
    fecha: Date
    tipo_venta: 'minorista' | 'mayorista'
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr'
    cliente?: string
    vendedor_nombre: string
    vendedor_id: string
    negocioId: string
    creadoEn: Date
    actualizadoEn: Date
    estado: "completada" | "cancelada" | "presupuesto"
    canceladoEn?: Date
    expiracion?: Date
}

export type UsuarioType = {
    id: string
    uid?: string
    nombreUsuario: string
    email: string
    negocioId: string
    nombreNegocio: string
    rol: 'admin' | 'vendedor' | 'superadmin'
}

export type ItemCarrito = ProductoType & {
    stockMaximo: number;
    cantidad: number;
    precio_venta?: number;
}

export type NegocioType = {
    id: string
    nombre: string
    activo: boolean
    adminId: string
    creadoEn: Date
}

export type MovimientoStockTipo =
    | "venta"
    | "cancelacion_venta"
    | "ajuste"
    | "compra"
    | "confirmacion_presupuesto";

export type MovimientoStockType = {
    id: string;
    negocioId: string;
    productoId: string;
    productoNombre: string;
    tipo: MovimientoStockTipo;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    ventaId?: string;
    usuarioId?: string;
    usuarioNombre?: string;
    motivo?: string;
    creadoEn: Date;
    esCorreccionAuditoria?: boolean;
};

export type InconsistenciaStock = {
    productoId: string;
    productoNombre: string;
    tipo:
    | "cantidad_incorrecta"
    | "ruptura_continuidad"
    | "stock_actual_incorrecto";
    detalle: string;
    movimientoId?: string;
    fechaMovimiento?: string;
    movimientoAnterior?: {
        id: string;
        stockNuevo: number;
        fecha: string;
    };
    stockAnteriorRegistrado?: number;
    stockUltimoMovimiento?: number;
    stockActual?: number;
};

export type ValidacionMovimientosStock = {
    success: boolean;
    productoId?: string | null;
    consistente: boolean;
    productosRevisados: number;
    movimientosRevisados: number;
    inconsistencias: InconsistenciaStock[];
    inicioAuditoria: string;
};

export type ResumenMovimientosStock = {
    success: boolean;
    desde: string;
    hasta: string;
    cantidadMovimientos: number;

    resumen: {
        ventas: number;
        cancelaciones: number;
        compras: number;
        ajustes: number;
        unidadesVendidas: number;
        unidadesCanceladas: number;
        unidadesCompradas: number;
        unidadesAjustadas: number;
        movimientoNeto: number;
    };

    vendedores: {
        usuarioId: string;
        nombre: string;
        ventas: number;
        unidadesVendidas: number;
    }[];
};