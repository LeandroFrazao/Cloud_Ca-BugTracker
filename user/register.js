const db = require("../db")();
var crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userHashKey = require("../user/hash")();
const users = require("../models/users")();
const nodemailer = require("nodemailer");
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       Register NEW USER                                \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.register = async (req, res, next) => {
  console.log(
    " --- register.register -------------------------------------------------- "
  );
  //  try {

  var newUser = {
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType,
    key: req.body.key,
  };
  console.log(newUser);
  const user = await users.get(newUser.email);
  console.log(user);
  // const { result, error } = await users.add(
  //   newUser.name,
  //   newUser.email,
  //   newUser.userType,
  //   newUser.key
  // );
  var result = [];
  result[0] = ["11"];
  console.log({ users: result[0] });
  // if (error) {
  //   console.log("Email already registered.");
  //   return res.status(500).json({ error: error });
  // }
  // //const { result, error } = await users.get(req.body.email);
  // if (error) {
  //   console.log({ user });
  // }

  // var token = {
  //   _userId: result[0]._id,
  //   token: crypto.randomBytes(16).toString("hex"),
  // };
  const randomToken = crypto.randomBytes(16).toString("hex");
  console.log(randomToken);
  const token = jwt.sign(
    {
      userId: result[0]._id,
    },
    randomToken,
    {
      expiresIn: "300", //5 minutes
    }
  );
  res.cookie("vrf", token, { secure: false, httpOnly: true });
  res.status(200).json({
    user: result[0],
    Information: "This token wil expire in 5min",
    token: token,
  });
  var mailOptions = {
    from: "no-reply@bugtrackapi.com",
    to: req.body.email,
    subject: "Account Verification Token",
    text:
      "Hello,\n\n" +
      "Please verify your account by clicking the link: \nhttp://" +
      req.headers.host +
      "/confirmation/" +
      randomToken +
      ".\n",
  };
  console.log(" >>>  Token: " + token);
  const userEmail = process.env.APIEMAIL;
  const passEmail = process.env.APIPASS;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.mail.gmail.com",
    port: 587,
    security: true,
    auth: {
      user: userEmail,
      pass: passEmail,
    },
  });
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready for messages");
    }
  });
  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      console.log("error to send email");
      return res.status(501).send({ msg: err.message });
    }
    console.log("To send email");
    res
      .status(200)
      .send("A verification email has been sent to " + req.body.email + ".");
  });
  //res.status(200).send();

  // res.send();
  //   } catch (error) {
  //     res.status(500).json({ error });
  //   }
};

exports.confirmation = async (req, res, next) => {
  var newUser = {
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType,
    key: req.body.key,
  };
  // Check for validation errors
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  // Find a matching token
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find a valid token. Your token my have expired.",
      });

    // If we found a token, find a matching user
    User.findOne(
      { _id: token._userId, email: req.body.email },
      function (err, user) {
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.isVerified)
          return res.status(400).send({
            type: "already-verified",
            msg: "This user has already been verified.",
          });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The account has been verified. Please log in.");
        });
      }
    );
  });
};
