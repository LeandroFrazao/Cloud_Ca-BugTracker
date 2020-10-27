const bcrypt = require("bcrypt");
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

  return {
    hash,
    compare,
  };
};
