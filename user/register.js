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
  if (res.error) {
    next();
  } else {
    //  try {

    var newUser = {
      name: req.body.name,
      email: req.body.email,
      userType: req.body.userType,
      key: req.body.key,
    };
    console.log(newUser);
    let user = await users.get(newUser.email);
    console.log("From users: ", user.result);
    //if user is already resgistered, return an error
    if (user.result) {
      console.log("Email already registered.");
      res.error = "Email already registered.";
      return next();
      // return res.status(500).json({ error: "Email already registered." });
    }

    let hashKey = await userHashKey.hash(newUser.key); // call a function to hash the user key

    // replace a document if it was found, or create a new one.
    user = await db.replace(
      "tempUsers",
      { email: newUser.email },
      {
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        key: hashKey,
      }
    );
    console.log("From tempUsers: ", user);
    console.log(hashKey);

    const randomToken = crypto.randomBytes(20).toString("hex");
    console.log("RANDOMTOKEN: ", randomToken);
    const token = jwt.sign(
      {
        user: req.body.email,
      },
      randomToken,
      {
        expiresIn: "1h", //one hour
      }
    );
    res.cookie("vrf", token, { secure: false, httpOnly: true });

    //message for the user
    const msgToUser = {
      user: "A verification email has been sent to " + req.body.email,
      Information:
        "Token wil expire in 1 hour. Token was sent in a cookie named vrf",
      token: token,
    };

    // create a message that is going to be sent by email
    var mailOptions = {
      from: "no-reply@bugtrackapi.com",
      to: req.body.email,
      subject: "Account Verification Token",
      text:
        "Hello,\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/verify/" +
        randomToken +
        ".\n",
    };
    console.log(" >>>  Token: " + token);

    const decodedToken = jwt.verify(token, randomToken);
    console.log("DecodeToken: ", decodedToken.user);

    //load enviroment variables for email server
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
        res.error = "error to send email";
        return next();
        // return res.status(501).send({ msg: err.message });
      }
      console.log("To send email to: ", req.body.email);
      res.success = msgToUser.user;

      return next();
      // res.status(200).send({
      //   user: msgToUser.user,
      //   Information: msgToUser.Information,
      //   Token: msgToUser.token,
      // });
      // res
      //   .status(200)
      //   .send(
      //     { msgToUser } +
      //       "A verification email has been sent to " +
      //       req.body.email +
      //       "."
      //   );
    });
    //res.status(300).send("A verification email has been sent to ");
    // res.status(200).send({
    //   user: msgToUser.user,
    //   Information: msgToUser.Information,
    //   Token: msgToUser.token,
    // });
    //res.send();
    //   } catch (error) {
    //     res.status(500).json({ error });
    //   }
  }
};

exports.confirmation = async (req, res, next) => {
  const randomToken = req.params.randomtoken; // randomToken that was sent by email
  let accessToken = req.cookies.vrf; //get the token from the cookie vrf
  console.log("RandomToken: ", randomToken);
  try {
    console.log("cookie: ", accessToken);

    //check if cookie exist, otherwise return an error
    if (!accessToken) {
      res.error = "No cookie found. Need to Register, go to:  '/register' ";
      return next();
      // return res.status(403).send({
      //   error: "No cookie found. Need to Register, go to:  '/register' ",
      // });
    }
    // verify toekn is valid
    const decodedToken = jwt.verify(accessToken, randomToken);
    //console.log("DecodeToken: ", decodedToken.user);

    //check if user is already verified
    let user = await db.get("users", { email: decodedToken.user });
    if (user[0]) {
      res.error = "The account has been verified. Please log in. ";
      return next();
      // return res
      //   .status(400)
      //   .send({ msg: "The account has been verified. Please log in." });
    }

    //check whether email exists in the tempUsers collection in mongoDB
    user = await db.get("tempUsers", { email: decodedToken.user });
    if (!user[0]) {
      res.error = "User Not Found for this token.";
      return next();
      //return res.status(400).send({ msg: "User Not Found for this token." });
    }

    //console.log("user from Token: ", user[0]);
    //  after token is verified, the user account is copied from tempUsers to users collections
    const results = await db.add("users", {
      name: user[0].name,
      email: user[0].email,
      userType: user[0].userType,
      key: user[0].key,
    });
    //then, after user document is added in users collection, data from tempUsers is deleted.
    await db.deleteOne("tempUsers", { _id: user[0]._id });
    console.log("user from Add: ", results.ops);
    res
      .status(200)
      .send({ msg: "The account has been verified. Please log in." });
  } catch (e) {
    res.error = "Your token expired.";
    return next();
    // return res.status(400).send({
    //   msg: "Your token expired.",
    // });
  }
};
