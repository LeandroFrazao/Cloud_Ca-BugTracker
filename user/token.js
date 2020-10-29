const jwt = require("jsonwebtoken");
const db = require("../db")();
const userHashKey = require("./user");

exports.login = (req, res, next) => {
  const findUserKey = async () => {
    console.log("hey");
    const email = req.body.email;
    try {
      const user = await db.get("users", { email: email });
      if (!user) {
        error = "User not Found!";
        return res.status(401).json({ error: error });
      }
      const key = req.body.key;
      const hashedKey = user[0].key;
      const verifyKey = await userHashKey.compare(key, hashedKey);
      if (!verifyKey) {
        error = "Incorrect Password!";
        return res.status(401).json({ error: error });
      }

      const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN", {
        expiresIn: "24h",
      });
      res.status(200).json({
        userId: user._id,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
  return {
    findUserKey,
  };
};
