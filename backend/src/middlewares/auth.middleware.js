import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

/**
 * Middleware to verify JWT access token and refresh it using the refresh token if necessary.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Attempt to retrieve the access token from cookies or Authorization header
    let accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (accessToken) {
      // Access token exists, verify it
      try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        await attachUserOrAdmin(decoded, req);
        return next();
      } catch (err) {
        // Access token is invalid or expired, proceed to check refresh token
        console.warn("Access token verification failed:", err.message);
      }
    }

    // Access token is missing or invalid, attempt to refresh using the refresh token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      // No tokens available, proceed without setting user/admin
      return next();
    }

    // Verify the refresh token
    let decodedRefresh;
    try {
      decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      // Refresh token is invalid or expired
      const Roptions={
        httpOnly:true,
        secure:true,
    }
      console.warn("Refresh token verification failed:", err.message);
      res
        .status(200)
        .clearCookie("refreshToken",Roptions);
      return next(); // Proceed without setting user/admin
    }

    // Find the user or admin associated with the refresh token
    let user = await User.findById(decodedRefresh._id);
    let admin = null;
    if (!user) {
      admin = await Admin.findById(decodedRefresh._id);
      if (!admin) {
        // No valid user or admin found
        throw new ApiError(401, "Invalid refresh token");
      }
    }

    // Generate a new access token
    const newAccessToken = user ? user.generateAccessToken() : admin.generateAccessToken();

    // Set the new access token in cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    // Attach the user or admin to the request object
    if (user) {
      req.user = user;
    } else {
      req.admin = admin;
    }

    // Proceed to the next middleware
    return next();
  } catch (error) {
    // Handle unexpected errors
    next(new ApiError(401, error.message || "Unauthorized"));
  }
});

/**
 * Helper function to attach user or admin to the request object based on decoded token.
 */
const attachUserOrAdmin = async (decoded, req) => {
  const user = await User.findById(decoded._id).select("-password -refreshToken");
  if (user) {
    req.user = user;
    return;
  }

  const admin = await Admin.findById(decoded._id).select("-password -refreshToken");
  if (admin) {
    req.admin = admin;
    return;
  }

  throw new ApiError(401, "Invalid access token");
};

/**
 * Middleware to verify if the request is made by an admin.
 */
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.admin) {
    throw new ApiError(401, "Unauthorized: Admin access required");
  }
  next();
});

/**
 * Middleware to verify if the request is made by a regular user.
 */
export const verifyUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: User access required");
  }
  next();
});
