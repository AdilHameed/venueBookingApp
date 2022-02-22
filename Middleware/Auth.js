const jwt = require("jsonwebtoken");
const User = require("../Model/user.js");

const user = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("You are not auhthorize to access it");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

const owner = () => {
  return (req, res, next) => {
    if (req.user.owner !== true) {
      return next(
        res.status(403).send({ error: "You are not auhthorize to access it" })
      );
    }

    next();
  };
};
module.exports = { user, owner };
