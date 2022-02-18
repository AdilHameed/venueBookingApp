const express = require("express");
const user = require("../Controller/user.js");
const auth = require("../Middleware/Auth.js");

const userRouter = express.Router();

userRouter.post("/signup", user.signUp);
userRouter.post("/login", user.logIn);
userRouter.get("/fetchBookedSlot", auth, user.fetchSlot);
userRouter.post("/logout", auth, user.logOut);

module.exports = userRouter;
