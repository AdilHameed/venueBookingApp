const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongodb connected successfully");
    });
};

module.exports = dbConnection;
