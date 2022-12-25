const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const UserSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  role: {
    type: "string",
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active :{
    type : "boolean",
    default: true,
    select : false,
  }
});

UserSchema.pre("save", async function (next) {
  // only run funtion if password was modified
  if (!this.isModified("password")) return next();
  // Hash the password with 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});
UserSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken;
};
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
