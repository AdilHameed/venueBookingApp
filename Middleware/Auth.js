const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const user = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line no-shadow
    const user = await User.findOne({
      // eslint-disable-next-line no-underscore-dangle
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

// eslint-disable-next-line consistent-return
const owner = () => (req, res, next) => {
  if (req.user.owner !== true) {
    return next(
      res.status(403).send({ error: "You are not auhthorize to access it" })
    );
  }

  next();
};
module.exports = { user, owner };
