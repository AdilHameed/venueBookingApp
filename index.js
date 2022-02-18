require("dotenv").config();
const express = require("express");
const db_Connection = require("./utils/db.js");

const venueBookingRouter = require("./Router/VenueBooking.js");
const userRouter = require("./Router/user.js");

const app = express();

app.use(express.json());

app.use("/venueBooking", venueBookingRouter);
app.use("/user", userRouter);

//DB Connection
db_Connection();

app.listen(process.env.PORT, (req, res) => {
  console.log(`server is listening on ${process.env.PORT}`);
});
