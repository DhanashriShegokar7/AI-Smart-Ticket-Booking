const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Otp = require("../models/Otp");


// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// EXISTING DIRECT LOGIN
// KEEPING THIS FOR NOW
// ==========================================

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// SEND LOGIN OTP
// ==========================================

const sendLoginOtp = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {

      return res.status(400).json({
        message:
          "Email and password are required",
      });

    }

    const normalizedEmail =
      email.toLowerCase().trim();


    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    // Check password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    // Generate 6 digit OTP
    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    // Remove previous OTPs
    await Otp.deleteMany({
      email: normalizedEmail,
    });


    // OTP expires in 5 minutes
    await Otp.create({

      email: normalizedEmail,

      otp,

      expiresAt:
        new Date(
          Date.now() +
          5 * 60 * 1000
        ),

    });


    // Send email
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: normalizedEmail,

      subject:
        "AI Smart Ticket Booking - Login OTP",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #f5f7fb;
          "
        >

          <div
            style="
              background: white;
              padding: 30px;
              border-radius: 10px;
            "
          >

            <h2
              style="
                color: #2563eb;
                text-align: center;
              "
            >
              AI Smart Ticket Booking
            </h2>

            <p>
              Hello ${user.name},
            </p>

            <p>
              Your OTP for login is:
            </p>

            <h1
              style="
                text-align: center;
                letter-spacing: 8px;
                color: #111827;
              "
            >
              ${otp}
            </h1>

            <p>
              This OTP is valid for
              <strong>5 minutes</strong>.
            </p>

            <p>
              Do not share this OTP with anyone.
            </p>

            <p>
              If you did not request this OTP,
              you can safely ignore this email.
            </p>

          </div>

        </div>
      `,
    });


    res.status(200).json({

      message:
        "OTP sent successfully",

    });

  } catch (error) {

    console.error(
      "Send OTP error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to send OTP",

    });

  }
};


// ==========================================
// VERIFY LOGIN OTP
// ==========================================

const verifyLoginOtp = async (req, res) => {

  try {

    const {
      email,
      otp,
    } = req.body;


    if (!email || !otp) {

      return res.status(400).json({

        message:
          "Email and OTP are required",

      });

    }


    const normalizedEmail =
      email.toLowerCase().trim();


    // Find OTP
    const otpRecord =
      await Otp.findOne({

        email: normalizedEmail,

        otp: otp.toString().trim(),

      });


    if (!otpRecord) {

      return res.status(401).json({

        message:
          "Invalid OTP",

      });

    }


    // Check expiry
    if (
      otpRecord.expiresAt <
      new Date()
    ) {

      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(401).json({

        message:
          "OTP expired",

      });

    }


    // Find user
    const user =
      await User.findOne({

        email: normalizedEmail,

      });


    if (!user) {

      return res.status(404).json({

        message:
          "User not found",

      });

    }


    // Generate JWT
    const token =
      jwt.sign(

        {
          userId: user._id,
          role: user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1d",
        }

      );


    // Delete used OTP
    await Otp.deleteOne({

      _id: otpRecord._id,

    });


    res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Verify OTP error:",
      error.message
    );

    res.status(500).json({

      message:
        "Failed to verify OTP",

    });

  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  registerUser,

  loginUser,

  sendLoginOtp,

  verifyLoginOtp,

};