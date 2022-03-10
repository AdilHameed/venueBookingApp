const mongoose = require("mongoose");

const { Schema } = mongoose;

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
    image: {
      type: String,
      required: [true, "Please add venue image"],
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
