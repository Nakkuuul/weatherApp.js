import { AuthModel } from "../models/auth.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

import weatherService from "../services/weather.service.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    const isAlreadyRegistered = await AuthModel.findOne({
      email: emailNormalized,
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await AuthModel.create({
      email: emailNormalized,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password both are required",
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    const validateUser = await AuthModel.findOne({ email: emailNormalized });

    if (!validateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== validateUser.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: validateUser._id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "User Validated Successfully",
      user: {
        email: validateUser.email,
      },
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

export async function getWeather(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({
        success: false,
        message: "City name is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Token",
      });
    }

    const weatherData = await weatherService(cityName);

    if (!weatherData) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: weatherData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}