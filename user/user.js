const bcrypt = require("bcrypt");
const db = require("../db")();
const saltRounds = 10;

module.exports = () => {
  //////////////////////////////////////////////////////////////////////////////////
  /////         HASH KEY                                           ////////////////
  ////////////////////////////////////////////////////////////////////////////////
  const hash = async (key) => {
    console.log(" ---userHashKey.hash --- ");
    let hashKey = null;
    await bcrypt.hash(key, saltRounds).then(function (hashUserKey) {
      hashKey = hashUserKey;
    });
    return hashKey;
  };

  //////////////////////////////////////////////////////////////////////////////////
  /////         COMPARE KEY                                        ////////////////
  ////////////////////////////////////////////////////////////////////////////////
  const compare = async (key, hashKey) => {
    console.log(" ---userHashKey.compare --- ");
    let isEqual = null;
    await bcrypt.compare(key, hashKey).then(function (result) {
      // result == true
      isEqual = result;
    });
    return isEqual;
  };

  const getByUserKey = async (suppliedUser, suppliedKey) => {
    if (!suppliedUser || !suppliedKey) {
      console.log("1: Missing User/Key");
      error = "Missing User/Key!";
      return null;
    }
    try {
      const user = await db.get("users", { email: suppliedUser });
      if (user.length == 0) {
        return null;
      }
      const hashedKey = user[0].key;
      console.log(suppliedKey);
      const verifyKey = await compare(suppliedKey, hashedKey);
      console.log(verifyKey);
      if (!verifyKey) {
        console.log("2: Bad key");
        error = "Wrong Password";
        return null;
      }
      return user[0];
    } catch (error) {
      return { error: error };
    }
    console.log("test");
  };

  return {
    hash,
    compare,
    getByUserKey,
  };
};
