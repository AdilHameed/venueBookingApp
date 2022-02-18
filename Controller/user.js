const userModel = require("../Model/user.js");
const venueBookingModel = require("../Model/VenueBooking.js");

exports.signUp = async (req, res) => {
  const newUser = new userModel(req.body);
  try {
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res.status(201).json({ newUser, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await userModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.logOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).send("User logged out");
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
};

exports.fetchSlot = async (req, res) => {
  try {
    const data = await venueBookingModel.find({ customer: req.user._id });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};
