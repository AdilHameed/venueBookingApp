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

app.use("/api/vend",(req, res)=>{
   res.send("deployed successfuly vend")
})
app.use("/api/user", userRouter);
app.use("/api/venue", venueRouter);
app.use("/api/venueBooking", venueBookingRouter);
app.get("/api/health",(req, res)=>{
  res.set('Cache-Control', 'no-store'); // prevent 304
  res.status(200).send('running successfully- pipeline');
})

// DB Connection
dbConnection();

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
});
