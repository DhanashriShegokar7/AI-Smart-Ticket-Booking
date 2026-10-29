const express = require("express");

const {
  registerUser,
  loginUser,
  sendLoginOtp,
  verifyLoginOtp,
} = require("../controllers/authController");

const router = express.Router();


// Register
router.post(
  "/register",
  registerUser
);


// Existing direct login
router.post(
  "/login",
  loginUser
);


// Send OTP
router.post(
  "/send-login-otp",
  sendLoginOtp
);


// Verify OTP
router.post(
  "/verify-login-otp",
  verifyLoginOtp
);


module.exports = router;