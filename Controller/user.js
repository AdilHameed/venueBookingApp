const UserModel = require("../Model/user");

exports.signUp = async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    const user = await newUser.save();
    const token = await newUser.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.logOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.status(200).send("User logged out");
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
};
