import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient"
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;