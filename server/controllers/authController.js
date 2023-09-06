const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    //const {email, password} = req.body;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    //if email & password both are not prsent
    if (!email || !password || !name) {
      // return res.status(403).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    //if user already exists:
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // res.status(409).send("user is already resgistered");
      res.send(error(409, "user already registered"));
      return;
    }
    //handle password:
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });
    // return res.status(201).json({
    //   message: "signup successful",
    //   data: user,
    // });
    const newUser = await User.findById(user._id); //find the user so that so that we don't send
    return res.send(                               //the password after the signup.
      success(201, {
        data: newUser,
      })
    );
  } catch (err) {
    res.send(error(500, err.message))
  }
};

const loginController = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // return res.status(404).json({
      //   message: "user not found",
      // });
      return res.send(error(404, "user not found"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).json({
      //   message: "Incorrect password",
      // });
      return res.send(403, "Incorrect password");
    }
    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.status(200).json({
    //   message: "login successful",
    //   accessToken: accessToken,
    // });
    return res.send(success(200, { accessToken }));
  } catch (err) {
    res.send(error(500, err.message));
  }
};
//this api will check the refreshToken validity & generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies; //extracting cookies array from req.cookies
  if (!cookies.jwt) {
    //if jwt cookie is not present then do below
    return res
      .status(401)
      .json({ message: "Refresh Token in cookies is required" });
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const id = decoded.id;
    const accessToken = generateAccessToken({ id });
    // return res.status(201).json({ accessToken });
    return res.send(success(201, { accessToken }));
  } catch (error) {
    console.log(error);
    // return res.status(401).send("Invalid refresh token");
    return res.send(error(401, "Invalid refresh token"));
  }
};
//internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "20s",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
//generate refresh token
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
};
