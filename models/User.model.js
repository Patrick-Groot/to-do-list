// https://www.makeuseof.com/user-authentication-in-nodejs/

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
    settings: {
      type: Object,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt` // ?
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
