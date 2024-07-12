const User = require("../models/UserModel.js");
const bcryptjs = require("bcryptjs");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username: username });
    if (usernameCheck) {
      return res.json({ msg: "Username Already Exist", status: false });
    }
    const emailCheck = await User.findOne({ email: email });
    if (emailCheck) {
      return res.json({ msg: "Email Already Exist", status: false });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.json({ status: true, newUser });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const usernameCheck = await User.findOne({ username: username });
    if (!usernameCheck) {
      return res.json({
        msg: "User not exist",
        status: false,
      });
    }
    const passcheck = await bcryptjs.compare(password, usernameCheck.password);
    if (!passcheck) {
      return res.json({ msg: "Incorrect password", status: false });
    }
    return res.json({ status: true, usernameCheck });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
};
