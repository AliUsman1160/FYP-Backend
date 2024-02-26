const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; 

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a user name."],
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "Password must be at least 6 characters long."],
    validate: {
      validator: (value) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol.",
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
