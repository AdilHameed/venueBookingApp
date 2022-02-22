const express = require("express");
const VenueBooking = require("../Controller/VenueBooking.js");
const auth = require("../Middleware/Auth.js");

const venueBookingRouter = express.Router();

//GET MOTHOD ROUTES

//for fetching available slots in particular venue with perticular date
venueBookingRouter.get(
  "/venue/:id/availableSlots",
  VenueBooking.getAvailableSlots
);

//for fetching slots booked by particular user
venueBookingRouter.get(
  "/fetchBookedSlotByUser",
  auth.user,
  VenueBooking.fetchSlotsByUser
);

//fetching slots booked in particular venue
venueBookingRouter.get(
  "/fetchBookedSlotByVenue/:id",
  auth.user,
  auth.owner(),
  VenueBooking.fetchSlotsByVenue
);

//POST METHOD ROUTES

//for booking slots in particular venue by user
venueBookingRouter.post(
  "/venue/:id/bookSlot",
  auth.user,
  VenueBooking.bookAvailableSlot
);

//PATCH METHOD ROUTES

//update bookings by id
venueBookingRouter.patch(
  "/bookSlot/:id",
  auth.user,
  VenueBooking.updateBookedSlot
);

// confirmation by owner of venue
venueBookingRouter.patch(
  "/bookSlot/:id/confirmation",
  auth.user,
  auth.owner(),
  VenueBooking.updateBookingConfirmation
);

//rejection bh by owner of venue
venueBookingRouter.patch(
  "/bookSlot/:id/rejection",
  auth.user,
  auth.owner(),
  VenueBooking.updateBookingRejection
);

//DELETE METHOD ROUTES
//deleting booked slot by user
venueBookingRouter.delete(
  "/bookSlot/:id",
  auth.user,
  VenueBooking.removeBookedSlot
);

module.exports = venueBookingRouter;
