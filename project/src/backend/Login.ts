const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const User = require("./models/UserSchema");

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

router.use(cookieParser());

router.post("/login", async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; token?: any; user?: { email: any; userId: any; }; }): any; new(): any; }; }; cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean; secure: boolean; sameSite: "strict"; maxAge: number; }) => void; }) => {
  const { email, password } = req.body;

  try {
    console.log("Received login request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).exec();
    if (!user || !user.password) {
      console.log("Invalid login attempt:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email, userId: user._id },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req: any, res: { clearCookie: (arg0: string, arg1: { httpOnly: boolean; secure: boolean; sameSite: "strict"; maxAge: number; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logout successful" });
});

export default router;
