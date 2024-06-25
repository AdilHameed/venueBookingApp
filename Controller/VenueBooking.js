/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const moment = require("moment");
const venueBookingModel = require("../Model/VenueBooking");
const venueModel = require("../Model/venue");

// GET METHOD CONTROLLER
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  const venueId = req.params.id;
  const bookingDate = moment(new Date(date));

  const slots = [
    { name: "MorningSlot" },
    { name: "AfternoonSlot" },
    { name: "EveningSlot" },
  ];
  try {
    // checking givendate should be greater then current date
    if (bookingDate > moment(new Date())) {
      const bookings = await venueBookingModel.find({
        bookingDate,
        venue: venueId,
        isRequested: true,
      });
      // .setOptions({ explain: "executionStats" });

      // filtering out available slots
      const arr = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const slot of slots) {
        let count = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const booking of bookings) {
          if (slot.name === booking.slot) {
            count += 1;
            break;
          }
        }
        if (count === 0) {
          arr.push(slot);
        }
      }
      res.status(200).json(arr);
    } else {
      res.status(406).json({ message: "Please enter valid date" });
    }
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
};

exports.fetchSlotsByUser = async (req, res) => {
  try {
    const data = await venueBookingModel
      .find({ customer: req.user._id })
      .sort([["updatedAt", -1]])
      .populate("venue", "name")
      .exec();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

// eslint-disable-next-line consistent-return
exports.fetchSlotsByVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    const venue = await venueModel.findById(venueId);
    if (req.user._id.toString() !== venue.owner.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    const data = await venueBookingModel
      .find({ venue: venueId })
      .sort([["updatedAt", -1]])
      .populate("customer", "name")
      .exec();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

// POST METHOD CONTROLLER
exports.bookAvailableSlot = async (req, res) => {
  const { date, reqSlot } = req.body;
  const venueId = req.params.id;
  const bookingDate = moment(new Date(date));

  try {
    const bookings = await venueBookingModel.find({
      bookingDate,
      venue: venueId,
    });

    const isBooked = bookings.some(
      (booking) => booking.slot === reqSlot && booking.isRequested === true
    );
    if (!isBooked) {
      // eslint-disable-next-line new-cap
      const newBooking = new venueBookingModel({
        bookingDate,
        slot: reqSlot,
        customer: req.user._id,
        venue: venueId,
      });
      await newBooking.save();
      res.status(201).send(newBooking);
    } else {
      res.status(406).send(`${reqSlot} is already booked `);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

// PATCH METHOD CONTROLLER
exports.updateBookedSlot = async (req, res) => {
  const { date, reqSlot } = req.body;
  const { id } = req.params;
  const bookingDate = moment(new Date(date));

  try {
    const booking = await venueBookingModel.findById(id);
    if (req.user._id.toString() !== booking.customer.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    if (booking) {
      const bookings = await venueBookingModel.find({
        bookingDate,
        venue: booking.venue,
      });

      const isBooked = bookings.some(
        (book) => book.slot === reqSlot && book.isRequested === true
      );

      if (!isBooked) {
        const updateBooking = await venueBookingModel
          .findByIdAndUpdate(
            id,
            {
              bookingDate,
              slot: reqSlot,
            },
            { new: true, runValidators: true }
          )
          .populate("venue", "name")
          .exec();
        res.status(200).send(updateBooking);
      } else {
        res.status(406).send(`${reqSlot} is already booked `);
      }
    } else {
      res.status(404).send(`Booking with id: ${id} not found`);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

// eslint-disable-next-line consistent-return
exports.updateBookingConfirmation = async (req, res) => {
  const { id } = req.params;

  try {
    const venues = await venueModel.find({ owner: req.user._id });

    const booking = await venueBookingModel.findById(id);

    const isOwner = venues.some(
      (venue) => venue._id.toString() === booking.venue.toString()
    );

    if (!isOwner) {
      return res.status(403).send("You are not authorize to access it");
    }
    const updateBookingConfimation = await venueBookingModel
      .findByIdAndUpdate(
        id,
        {
          isConfirmed: true,
        },
        { new: true, runValidators: true }
      )
      .populate("customer", "name")
      .exec();
    res.status(200).send(updateBookingConfimation);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

exports.updateBookingRejection = async (req, res) => {
  const { id } = req.params;
  try {
    const venues = await venueModel.find({ owner: req.user._id });
    const booking = await venueBookingModel.findById(id);
    const isOwner = venues.some(
      (venue) => venue._id.toString() === booking.venue.toString()
    );
    if (!isOwner) {
      return res.status(403).send("You are not authorize to access it");
    }
    const updateBookingRejection = await venueBookingModel
      .findByIdAndUpdate(
        id,
        {
          isRequested: false,
        },
        { new: true, runValidators: true }
      )
      .populate("customer", "name")
      .exec();
    res.status(200).send(updateBookingRejection);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

// DELETE METHOD CONTROLLER
exports.removeBookedSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await venueBookingModel.findById(id);
    if (req.user._id.toString() !== booking.customer.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    const data = await venueBookingModel.findByIdAndDelete(id);
    if (data) res.status(200).send(id);
    else {
      res.status(404).send(`Slot with id:${id} does not exist`);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};
