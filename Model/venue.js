const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema(
  {
    name: { type: String, required: [true, "Please enter venue name"] },

    description: {
      type: String,
      required: [true, "Please Enter product Description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const venueModel = mongoose.model("Venue", venueSchema);
module.exports = venueModel;
