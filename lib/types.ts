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
    items: ItemVentaType[]
    total: number
    totalGastado: number
    fecha: Date
    tipo_venta: 'minorista' | 'mayorista'
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia'
    cliente?: string
    vendedor_nombre: string
    vendedor_id: string
    negocioId: string
    creadoEn: Date
    actualizadoEn: Date
}

export type UsuarioType = {
    id: string
    uid?: string
    nombre: string
    email: string
    negocioId: string
    nombreNegocio: string
    rol: 'admin' | 'vendedor'
}

export type ItemCarrito = ProductoType & {
    stockMaximo: number;
    cantidad: number;
    precio_venta?: number;
}