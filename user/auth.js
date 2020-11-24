const jwt = require("jsonwebtoken");
const token = require("./token");
const users = require("../models/users")();

exports.auth = (req, res, next) => {
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //\\                 Verify Token from cookie                               \\\\\\\\\\\\\\\\\\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  try {
    //get the token from the cookie jwt
    let accessToken = req.cookies.jwt;
    //console.log(req.cookies.jwt);
    //check if cookie exist, otherwise return an error
    if (!accessToken) {
      return res.status(403).send({
        error: "Need to Login, go to:  '/login' and user your credencials ",
      });
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

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                      Level Access Security                             \\\\\\\\\\\\\\\\\\\
//\\                      Only Admin has access to:                         \\\\\\\\\\\\\\\\\\\
//\\                      Get all users; Get users by ID; Add new user      \\\\\\\\\\\\\\\\\\\
//\\                      Add Project;                                      \\\\\\\\\\\\\\\\\\\
//\\                      Update status of an Issue                         \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.accessLevel = async (req, res, next) => {
  console.log(" ---auth.accessLevel --- ");
  console.log("access level", this.currentUser);
  try {
    console.log(this.currentUser.userId);
    if ((await this.currentUser.userType) != "admin") {
      // check if user is admin, if not, reject access to the route
      //and print informations of the current user on the screen
      const { result, error } = await users.get(this.currentUser.userId);
      if (error) {
        res.status(500).json({ error });
      }
      const results = { user: result, Security: "Restrict Access" };
      console.log("Restrict Access");
      return res.status(200).json(results);
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
