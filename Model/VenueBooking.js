const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const venueBookingSchema = new Schema(
  {
    bookingDate: {
      type: Date,
      min: [moment(new Date()).add(1, "days"), "Please enter valid date"],
      index: { background: true },
    },
    slot: {
      type: String,
      enum: ["MorningSlot", "AfternoonSlot", "EveningSlot"],
      required: [true, "Please provide slot name"],
    },

    isRequested: { type: Boolean, default: true },
    isConfirmed: { type: Boolean, default: false },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Venue",
    },
  },
  {
    timestamps: true,
  }
);

const venueBookingModel = mongoose.model("VenueBooking", venueBookingSchema);
module.exports = venueBookingModel;
