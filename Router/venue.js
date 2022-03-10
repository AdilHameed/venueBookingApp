const express = require("express");
const Venue = require("../Controller/venue");
const auth = require("../Middleware/Auth");

const venueRouter = express.Router();

// GET METHOD ROUTES
// Fetch all venue
venueRouter.get("/fetchAllVenue", Venue.getAllVenues);

// fetch venue by id
venueRouter.get("/fetchVenue/:id", Venue.getSingleVenue);

// fetch venue by owner
venueRouter.get(
  "/fetchVenueByOwner",
  auth.user,
  auth.owner(),
  Venue.getVenueByOwner
);

// POST METHOD ROUTES
// create venue by owner
venueRouter.post("/addVenue", auth.user, auth.owner(), Venue.createVenue);

// PATCH METHOD ROUTES
// update venue by owner
venueRouter.patch("/editVenue/:id", auth.user, auth.owner(), Venue.updateVenue);

// DELETE METHOD ROUTES
// delete venue by owner
venueRouter.delete(
  "/deleteVenue/:id",
  auth.user,
  auth.owner(),
  Venue.removeVenue
);

module.exports = venueRouter;
