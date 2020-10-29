const bcrypt = require("bcrypt");
const db = require("../db")();
const jwt = require("jsonwebtoken");
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
      return null;
    }
    try {
      const user = await db.get("users", { email: suppliedUser });
      const hashedKey = user[0].key;
      const verifyKey = await compare(suppliedKey, hashedKey);
      if (!verifyKey) {
        console.log("2: Wrong key");
        return null;
      }

      return user[0];
    } catch (error) {
      return { error: error };
    }
  };

  return {
    hash,
    compare,
    getByUserKey,
  };
};
