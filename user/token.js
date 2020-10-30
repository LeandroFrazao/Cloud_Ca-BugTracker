const jwt = require("jsonwebtoken");
const db = require("../db")();
const userHashKey = require("./hash")();
const crypto = require("crypto");

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       LOGIN                                            \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.login = async (req, res, next) => {
  const email = req.body.email;
  try {
    // check if the email exist in the database.
    const user = await db.get("users", { email: email });
    console.log(user.length);
    if (!user || user.length == 0) {
      error = "User not Found!";
      return res.status(401).json({ error: error });
    }
    const key = req.body.key;
    const hashedKey = user[0].key;
    //call a function to compare the key with the hashedKey stored in the database
    const verifyKey = await userHashKey.compare(key, hashedKey);
    //if the key is valid, the verifiedKey is true, otherwise false.
    if (!verifyKey) {
      error = "Incorrect Password!";
      return res.status(401).json({ error: error });
    }
    // create a random string to be included in the token.
    const RANDOM_TOKEN = crypto.randomBytes(15).toString("HEX");
    //token is generate using user id and the random string. the token is set to be valid for 24 hours, while the user is using the API
    const token = jwt.sign({ userId: user[0]._id }, RANDOM_TOKEN, {
      expiresIn: "24h",
    });
    // generate a cookie containing the token
    res.cookie("jwt", token, { secure: true, httpOnly: true });
    res.status(200).json({
      user: user[0].email,
      Information: "This token below was sent in a cookie named jwt",
      token: token,
    });
    // export the random the string to be used for authentication (auth.js).
    //Need to be observed that the cookie only is valid, while the user is using the API.
    //If the user closes the browser or app that is using the api, this variable "RANDOM_TOKEN" gets UNDEFINED value.
    module.exports.RANDOM_TOKEN = RANDOM_TOKEN;
    res.send();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
