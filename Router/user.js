const express = require("express");
const user = require("../Controller/user.js");
const auth = require("../Middleware/Auth.js");

const userRouter = express.Router();

userRouter.post("/signup", user.signUp);
userRouter.post("/login", user.logIn);
userRouter.post("/logout", auth.user, user.logOut);

module.exports = userRouter;
