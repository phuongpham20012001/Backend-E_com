const User = require("./../models/userModel");
const crypto = require("crypto");
const { promisify } = require("util");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt = require("jsonwebtoken");
const sendEmail = require("../ulti/email.js");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN);
};
// send data
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: new Date(),
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check the existing
    if (!email || !password) {
      return next(
        res.status(400).json({ message: "Invalid email or password " })
      );
    }
    // check user exiting and password is correctPassword
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        res.status(401).json({ message: "Invalid correct email or password " })
      );
    }
    // everything is okay, send JWT back
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.protect = async function (req, res, next) {
  try {
    let token;
    // check the token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    // validate the token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN
    );
    //check if user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "The user belonging to this token does not exist" });
    }
    // check if the user changed their password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        message: "User recently changed password! please log in again",
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.restrictTo = (...roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(401)
          .json({ message: "You do not have permission to access this" });
      }
      next();
    };
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    // get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    // generate the random token
    const resetToken = user.createPasswordResetToken();
    // need {validateBeforeSave: false} because having a lot of validate before saving.
    await user.save({ validateBeforeSave: false });

    // send it to user's email
    // change the link to URL of front end
    const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

    const message = `Your link to reset password, ${resetURL}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your token is valid for 10 mins",
        message,
      });
      res.status(200).json({
        status: "success",
        message: "Token sent",
      });
    } catch (err) {
      user.passwordResetExpires = undefined;
      user.passwordResetToken = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    // // get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    //if the token is valid and user still exists then set the new password
    if (!user) {
      return res.status(400).json({ message: "token is invalid" });
    }
    (user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm),
      (user.passwordResetToken = undefined);
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updatePassword = async (req, res, next) => {
  try {
    // get user from database
    const user = await User.findById(req.user.id).select("+password");
    // check if posted current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return res.status(401).json({ message: "your password is incorrect" });
    }
    // if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // log user in send jwt
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
