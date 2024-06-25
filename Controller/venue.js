/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const VenueModel = require("../Model/venue");

// GET METHOD CONTROLLER
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await VenueModel.find({});

    if (venues) res.status(200).json({ venues });
    else res.status(404).json({ message: "No venue found." });
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
};

exports.getSingleVenue = async (req, res) => {
  const { id } = req.params;
  try {
    const venue = await VenueModel.findById(id);
    if (venue) res.status(200).send(venue);
    else res.status(404).json({ message: "No venue found." });
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
};
exports.getVenueByOwner = async (req, res) => {
  try {
    const venues = await VenueModel.find({ owner: req.user._id });

    if (venues) res.status(200).json({ venues });
    else res.status(404).json({ message: "No venue found." });
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
};

// POST METHOD CONTROLLER
exports.createVenue = async (req, res) => {
  const newVenue = new VenueModel({ ...req.body, owner: req.user._id });
  try {
    await newVenue.save();
    res.status(201).send(newVenue);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

// PATCH METHOD CONTROLLER
exports.updateVenue = async (req, res) => {
  const { id } = req.params;

  try {
    const venue = await VenueModel.findById(id);

    if (req.user._id.toString() !== venue.owner.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    const updateVenue = await VenueModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updateVenue) res.status(201).send(updateVenue);
    else res.status(404).send("Not Found");
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

// DELETE METHOD CONTROLLER
exports.removeVenue = async (req, res) => {
  const { id } = req.params;
  try {
    const venue = await VenueModel.findById(id);

    if (req.user._id.toString() !== venue.owner.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    const data = await VenueModel.findByIdAndDelete(id);
    if (data) res.status(200).send(data._id);
    else {
      res.status(404).send(`Venue with id:${id} does not exist`);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};
