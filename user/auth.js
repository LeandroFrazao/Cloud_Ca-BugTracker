const jwt = require("jsonwebtoken");
const token = require("./token");

module.exports = (req, res, next) => {
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //\\                 Verify Token from cookie                               \\\\\\\\\\\\\\\\\\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  try {
    //get the token from the cookie jwt
    let accessToken = req.cookies.jwt;
    //console.log(req.cookies.jwt);
    //check if cookie exist, otherwise return an error
    if (!accessToken) {
      return res.status(403).send({ error: "Invalid" });
    }
    //console.log(token.RANDOM_TOKEN);
    // import the random string from token.js
    const RANDOM_TOKEN = token.RANDOM_TOKEN;
    //Check whether the token is valid, if not, it returns an error.
    const decodedToken = jwt.verify(accessToken, RANDOM_TOKEN);
    //onsole.log(decodedToken);
    const userType = decodedToken.userType;
    const userId = decodedToken.userId;
    const userEmail = decodedToken.userEmail;
    console.log(userType);
    module.exports.currentUser = { userType, userId, userEmail };
    next();
  } catch (error) {
    error = "Access Denied";
    return res.status(401).json({ error: error });
  }
};
