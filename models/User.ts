// import mongoose, { type Document, Model, Schema } from "mongoose"

export interface IUser extends Document {
  nombre: string
  email: string
  password: string
  rol: string
  creadoEn: Date
  actualizadoEn: Date
}

// const UserSchema = new Schema<IUser>(
//   {
//     nombre: {
//       type: String,
//       trim: true,
//       maxlength: [50, "Nombre no puedo exceder los 50 caracteres"],
//     },
//     email: {
//       type: String,
//       trim: true,
//       maxlength: [100, "Email no puede exceder los 100 caracteres"],
//     },
//     password: {
//       type: String,
//     },
//     rol: {
//       type: String,
//       enum: ['admin', 'user'],
//       default: 'user'
//     }
//   },
//   {
//     timestamps: true,
//   },
// )

// const UserModel : Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
// export default UserModel 
