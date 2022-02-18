const express = require("express");
const VenueBooking = require("../Controller/VenueBooking.js");
const auth = require("../Middleware/Auth.js");

const venueBookingRouter = express.Router();

venueBookingRouter.get("/availableSlots", VenueBooking.getAvailableSlots);
venueBookingRouter.post("/bookSlot", auth, VenueBooking.bookAvailableSlot);
venueBookingRouter.patch("/bookSlot/:id", auth, VenueBooking.updateBookedSlot);
venueBookingRouter.delete("/bookSlot/:id", auth, VenueBooking.removeBookedSlot);

module.exports = venueBookingRouter;
