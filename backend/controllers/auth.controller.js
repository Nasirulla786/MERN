import generateToken from "../config/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Require all fields" });
    }
    const alreadyUserName = await User.findOne({ username }).select(
      "username _id",
    );

    if (alreadyUserName) {
      return res
        .status(400)
        .json({ message: "Email and username already exists" });
    }
    const alreadyEmail = await User.findOne({ email }).select("email  _id");
    if (alreadyEmail) {
      return res
        .status(400)
        .json({ message: "Email and username already exists" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    const token = await generateToken(newUser._id);

    if (!token) {
      return res.status(400).json({ message: "Token cant be generate" });
    }

    res.cookie("token", token, {
      httpOnly: true,
        secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ message: "user create successfully", user: newUser });
  } catch (error) {
    console.error("Register controller Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Require all fields" });
    }

    const alreadyEmail = await User.findOne({ email }).select("+password");
    if (!alreadyEmail) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, alreadyEmail?.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = await generateToken(alreadyEmail._id);

    if (!token) {
      return res.status(400).json({ message: "Token cant be generate" });
    }

    res.cookie("token", token, {
      httpOnly: true,
        secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "user Login successfully", user: alreadyEmail });
  } catch (error) {
    console.error("Login controller Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Logout controller Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
