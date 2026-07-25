// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import User from "../models/User.js";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || "7d",
//   });
// };

// // ====================== REGISTER ======================
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: "Please provide all fields" });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     const user = await User.create({ name, email, password });

//     res.status(201).json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ====================== LOGIN ======================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Please provide email and password" });
//     }

//     const user = await User.findOne({ email }).select("+password");

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({ success: false, message: "Your account has been blocked" });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ====================== GET ME ======================
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ====================== FORGOT PASSWORD ======================
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found with this email" });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

//     await user.save({ validateBeforeSave: false });

//     // Development ke liye token return kar rahe hain
//     // Production mein email bhejna chahiye
//     res.status(200).json({
//       success: true,
//       message: "Password reset token generated successfully",
//       resetToken, // ← Sirf development mein
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ====================== RESET PASSWORD ======================
// export const resetPassword = async (req, res) => {
//   try {
//     const resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid or expired token" });
//     }

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password reset successful",
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ====================== LOGOUT (Optional - Client side mostly) ======================
// export const logout = async (req, res) => {
//   res.status(200).json({ success: true, message: "Logged out successfully" });
// };
// const token = jwt.sign(
//   { id: user._id, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: process.env.JWT_EXPIRE || "7d" }
// );

// res.json({
//   success: true,
//   data: {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token, // ← YE IMPORTANT
//   },
// });
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// ====================== REGISTER ======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Your account has been blocked" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET ME ======================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== FORGOT PASSWORD ======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Password reset token generated successfully",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== RESET PASSWORD ======================
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== LOGOUT ======================
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};