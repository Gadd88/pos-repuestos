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
    | "compra";

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
};