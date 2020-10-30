const jwt = require("jsonwebtoken");
const token = require("./token");
module.exports = (req, res, next) => {
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //\\                 Verify Token from cookie                               \\\\\\\\\\\\\\\\\\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  try {
    //get the token from the cookie jwt
    let accessToken = req.cookies.jwt;
    console.log(req.cookies.jwt);
    //check if cookie exist, otherwise return an error
    if (!accessToken) {
      return res.status(403).send({ error: "Invalid Token" });
    }
    console.log(token.RANDOM_TOKEN);
    // import the random string from token.js
    const RANDOM_TOKEN = token.RANDOM_TOKEN;
    //Check whether the token is valid, if not, it returns an error.
    const decodedToken = jwt.verify(accessToken, RANDOM_TOKEN);
    console.log(decodedToken);
    next();
  } catch (error) {
    error = "Invalid request!";
    return res.status(401).json({ error: error });
  }
};
