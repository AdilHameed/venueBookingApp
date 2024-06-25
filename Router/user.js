const express = require("express");
const user = require("../Controller/user");
const auth = require("../Middleware/Auth");

const userRouter = express.Router();

userRouter.post("/signup", user.signUp);
userRouter.post("/login", user.logIn);
userRouter.post("/logout", auth.user, user.logOut);

module.exports = userRouter;
