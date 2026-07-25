// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const addressSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   phone: { type: String, required: true },
//   addressLine1: { type: String, required: true },
//   addressLine2: String,
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   pincode: { type: String, required: true },
//   country: { type: String, default: "India" },
//   isDefault: { type: Boolean, default: false },
// });

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     addresses: [
//   {
//     fullName: String,
//     phone: String,
//     address: String,
//     city: String,
//     state: String,
//     pincode: String,
//     isDefault: { type: Boolean, default: false },
//   },
// ],
// phone: { type: String },
//     password: { type: String, required: true, minlength: 6, select: false },
//     role: {
//       type: String,
//       enum: ["customer", "admin"],
//       default: "customer",
//     },
//     isBlocked: { type: Boolean, default: false },
//     addresses: [addressSchema],
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//   },
//   { timestamps: true }
// );

// // ========== FIXED PRE-SAVE MIDDLEWARE ==========
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// // Compare password method
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);