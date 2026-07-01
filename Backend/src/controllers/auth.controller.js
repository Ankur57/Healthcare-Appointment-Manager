import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists"
      });
    }

    const user =
      await User.create({
        name,
        email,
        password,
        role: "patient"
      });

    const token =
      user.generateToken();

    res.cookie(
      "accessToken",
      token,
      {
        httpOnly: true,
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000
      }
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",
      user,token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const login = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({
        email
      }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials"
      });
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials"
      });
    }

    const token =
      user.generateToken();

    res.cookie(
      "accessToken",
      token,
      {
        httpOnly: true,
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      user,token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const logout = async (
  req,
  res
) => {
  res.clearCookie(
    "accessToken"
  );

  return res.status(200).json({
    success: true,
    message:
      "Logout successful"
  });
};
export const getMe = async (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};