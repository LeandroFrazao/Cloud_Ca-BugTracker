const db = require("../db")();
var crypto = require("crypto");
const users = require("../models/users")();
const nodemailer = require("nodemailer");
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       Register NEW USER                                \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.register = async (req, res, next) => {
  //   try {
  console.log(req.body.email);
  const { result, error } = await users.get(req.body.email);
  if (error) {
    console.log(error);
  }
  if (result) {
    console.log("Email already registered.");
    //return res.status(500).json({ error: "Email already registered." });
  }
  var user = {
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType,
    key: req.body.key,
  };
  console.log("aqui " + req.body.email);
  var token = {
    _userId: "123456",
    token: crypto.randomBytes(16).toString("hex"),
  };
  var mailOptions = {
    from: "no-reply@bugtrackapi.com",
    to: req.body.email,
    subject: "Account Verification Token",
    text:
      "Hello,\n\n" +
      "Please verify your account by clicking the link: \nhttp://" +
      "req.headers.host" +
      "/confirmation/" +
      token.token +
      ".\n",
  };
  console.log("aqui " + token.token);
  const userEmail = process.env.APIEMAIL;
  const passEmail = process.env.APIPASS;
  var transporter = nodemailer.createTransport({
    service: "yahoo",
    host: "smtp.mail.yahoo.com",
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
  await transporter.sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(501).send({ msg: err.message });
    }
    res
      .status(200)
      .send("A verification email has been sent to " + req.body.email + ".");
  });

  // res.send();
  //   } catch (error) {
  //     res.status(500).json({ error });
  //   }
};
