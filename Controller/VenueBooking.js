const venueBookingModel = require("../Model/VenueBooking.js");
const venueModel = require("../Model/venue.js");
const moment = require("moment");

//GET METHOD CONTROLLER
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  const venueId = req.params.id;
  const bookingDate = moment(new Date(date)).add(1, "days");

  let slots = ["MorningSlot", "AfternoonSlot", "EveningSlot"];
  try {
    // checking givendate should be greater then current date
    if (bookingDate > moment(new Date()).add(1, "days")) {
      const bookings = await venueBookingModel.find({
        bookingDate,
        venue: venueId,
        isRequested: true,
      });
      // .setOptions({ explain: "executionStats" });

      //filtering out available slots
      let arr = [];
      for (let slot of slots) {
        let count = 0;
        for (let booking of bookings) {
          if (slot === booking.slot) {
            count++;
            break;
          }
        }
        if (count === 0) {
          arr.push(slot);
        }
      }
      res.status(200).json({ message: "available slots", data: arr });
    } else {
      res.status(406).json({ message: "Please enter valid date" });
    }
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
};

exports.fetchSlotsByUser = async (req, res) => {
  try {
    const data = await venueBookingModel.find({ customer: req.user._id });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

exports.fetchSlotsByVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    const venue = await venueModel.findById(venueId);
    console.log(req.user._id.toString(), venue.owner.toString());
    if (req.user._id.toString() !== venue.owner.toString()) {
      return res.status(403).send("You are not authorize to access it");
    }
    const data = await venueBookingModel.find({ venue: venueId });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

//POST METHOD CONTROLLER
exports.bookAvailableSlot = async (req, res) => {
  const { date, reqSlot } = req.body;
  const venueId = req.params.id;
  const bookingDate = moment(new Date(date)).add(1, "days");

  try {
    const bookings = await venueBookingModel.find({
      bookingDate,
      venue: venueId,
    });

    const isBooked = bookings.some(
      (booking) => booking.slot === reqSlot && booking.isRequested === true
    );
    if (!isBooked) {
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
    console.log(err);
    res.status(500).send("Error: " + err.message);
  }
};

//PATCH METHOD CONTROLLER
exports.updateBookedSlot = async (req, res) => {
  const { date, reqSlot } = req.body;
  const { id } = req.params;
  const bookingDate = moment(new Date(date)).add(1, "days");

  try {
    const booking = await venueBookingModel.findById(id);
    if (req.user._id !== booking.customer) {
      throw new Error("You are not authorize to access it");
    }
    if (booking) {
      const bookings = await venueBookingModel.find({
        bookingDate,
        venue: booking.venue,
      });

      const isBooked = bookings.some(
        (booking) => booking.slot === reqSlot && booking.isRequested === true
      );

      if (!isBooked) {
        const updateBooking = await venueBookingModel.findByIdAndUpdate(
          id,
          {
            bookingDate,
            slot: reqSlot,
          },
          { new: true, runValidators: true }
        );
        res.status(200).send(updateBooking);
      } else {
        res.status(406).send(`${reqSlot} is already booked `);
      }
    } else {
      res.status(404).send(`Booking with id: ${id} not found`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error: " + err.message);
  }
};

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
    const updateBookingConfimation = await venueBookingModel.findByIdAndUpdate(
      id,
      {
        isConfirmed: true,
      },
      { new: true, runValidators: true }
    );
    res.status(200).send(updateBookingConfimation);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
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
      throw new Error("You are not authorize to access it");
    }
    const updateBookingRejection = await venueBookingModel.findByIdAndUpdate(
      id,
      {
        isRequested: false,
      },
      { new: true, runValidators: true }
    );
    res.status(200).send(updateBookingRejection);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

//DELETE METHOD CONTROLLER
exports.removeBookedSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await venueBookingModel.findById(id);
    if (req.user._id !== booking.customer) {
      throw new Error("You are not authorize to access it");
    }
    const data = await venueBookingModel.findByIdAndDelete(id);
    if (data) res.status(200).send(`Slot deleted with id:${id}`);
    else {
      res.status(404).send(`Slot with id:${id} does not exist`);
    }
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
