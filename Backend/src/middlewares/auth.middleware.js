import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.cookies.accessToken
    ) {
      token =
        req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized"
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user =
      await User.findById(
        decoded._id
      ).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Unauthorized"
    });
  }
};

export default protect;