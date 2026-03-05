import User from "../models/user.model.js";


// cookie configurations
const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
};

// controller to generate access & refresh token
const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Couldn't find an account associated with that ID.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error(
        "Something went wrong while securing your session. Please try again.",
      );
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Token Generation error:".error);
    throw new Error(
      error.message || "An unexpected error occurred during authentication.",
    );
  }
};

// controller to register user
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password",
        success: false,
      });
    }

    const userExist = await User.find({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User already exists With this email",
        success: false,
      });
    }

    const user = await User.create({
      userName,
      email,
      password,
    });

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id,
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Welcome! Your account has been created successfully.",
        user,
        success: true,
      });
  } catch (error) {
    console.log("Registration Error:", error);
    return res.status(500).json({
      message: "Something went wrong on our end. Please try again later",
      success: false,
    });
  }
};

// controller to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        message: "Invalid email or password. Please try again",
        success: false,
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: `Welcome back, ${loggedInUser.userName}!`,
        user: loggedInUser,
        success: true,
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "We're having trouble logging you in. Please try again shortly.",
      success: false,
    });
  }
};

export { registerUser, loginUser };
