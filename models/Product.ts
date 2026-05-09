
export interface IProduct extends Document {
  nombre: string
  descripcion: string
  precio_compra: number
  stock: number
  precio_venta_minorista: number
  precio_venta_mayorista: number
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// const ProductSchema = 
//   {
//     nombre: {
//       type: String,
//       required: [true, "Nombre del producto es requerido"],
//       trim: true,
//       maxlength: [100, "Nombre del producto no puede superar los 100 caracteres"],
//     },
//     descripcion: {
//       type: String,
//       required: [true, "Descripción del producto es requerida"],
//       trim: true,
//       maxlength: [500, "Descripción del producto no puede superar los 500 caracteres"],
//     },
//     precio_compra: {
//       type: Number,
//       required: [true, "Precio de compra del producto es requerido"],
//       min: [0, "El precio no puede ser negativo"],
//     },
//     stock: {
//       type: Number,
//       required: [true, "Cantidad en stock es requerida"],
//       min: [0, "El stock no puede ser negativo"],
//       default: 0,
//     },
//     precio_venta_minorista: {
//       type: Number,
//       required: [true, "Precio de venta minorista del producto es requerido"],
//       min: [0, "El precio no puede ser negativo"],
//     },
//     precio_venta_mayorista: {
//       type: Number,
//       required: [true, "Precio de venta mayorista del producto es requerido"],
//       min: [0, "El precio no puede ser negativo"],
//     },
//     activo: {
//       type: Boolean,
//       default: true,
//     }
//   },
//   {
//     timestamps: true,
//   },


// // Create indexes for better query performance
// // ProductSchema.index({ name: "text", description: "text" })
// // ProductSchema.index({ category: 1 })
// // ProductSchema.index({ stock: 1 })

// const ProductModel : Model<IProduct> = mongoose.models.varios || mongoose.model<IProduct>("varios", ProductSchema, "varios")
// export default ProductModel 
