require("dotenv").config({ path: "./env/.env" });
const express = require("express");
const cors = require("cors");
const venueBookingRouter = require("./Router/VenueBooking");
const venueRouter = require("./Router/venue");
const userRouter = require("./Router/user");
const dbConnection = require("./utils/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/vend",(req, res)=>{
   res.send("deployed successfuly vend")
})
app.use("/user", userRouter);
app.use("/venue", venueRouter);
app.use("/venueBooking", venueBookingRouter);

// DB Connection
dbConnection();

// eslint-disable-next-line no-undef
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-undef
  console.log(`server is listening on ${process.env.PORT}`);
});
