import { AuthModel } from "../models/auth.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const isAlreadyRegistered = await AuthModel.findOne({
      email,
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "Username or Email already exist",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await AuthModel.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
