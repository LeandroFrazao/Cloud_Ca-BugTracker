const db = require("../db")();
const userHashKey = require("../user/userHashKey")();

const COLLECTION = "users";
const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    console.log(" --- usersModel.get --- ");
    var users = null; //initialize variable
    if (!id) {
      // check if id is null
      try {
        users = await db.get(COLLECTION);
        if (users.length == 0) {
          error = "No Users Registered";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
    } else {
      try {
        if (ObjectID.isValid(id)) {
          //check if object is valid
          users = await db.get(COLLECTION, { _id: ObjectID(id) }); //first try to find using _id, if it returns empty array, then try by email
        } else {
          users = await db.get(COLLECTION, { email: id.toLowerCase() }); //use objectid to get id from mongodb
        }
        if (users.length == 0) {
          error = "User not Found!";
          return { error: error };
        }
        // console.log("Compare Key and HashKey, result is: " await userHashKey.compare("123456", users[0].key));  //to check hashKey
      } catch (error) {
        return { error: error };
      }
    }
    return users;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const add = async (name, email, userType, key) => {
    console.log(" --- usersModel.add --- ");
    try {
      if (
        // check if the userType is valid according to the parameters bellow.
        userType != "user" &&
        userType != "admin"
      ) {
        error = "Invalid User Type (" + userType + "). Must Be: user or admin";
        return { error: error };
      }
      if (email.length < 5) {
        // a@a.a minimum length required for email is 5 characters
        error = "Email (" + email + ") is invalid";
        return { error: error };
      }
      if (key.length < 6) {
        //  minimum length required for key is 6 characters
        error = "Key length (" + key.length + ") must be greater than 6";
        return { error: error };
      }
    } catch (error) {
      error = "Fields name, email, userType or key MUST NOT BE EMPTY";
      return { error: error };
    }

    try {
      //check if email was already registered
      const users = await db.get(COLLECTION, { email: email }); //use objectid to get id from mongodb
      if (users.length > 0) {
        error = "Email (" + email + ") is already being Used.";
        return { error: error };
      }
    } catch (error) {
      return { error: error };
    }

    let hashKey = await userHashKey.hash(key); // call a function to hash the user key

    const results = await db.add(COLLECTION, {
      name: name,
      email: email,
      userType: userType,
      key: hashKey,
    });
    return results.result;
  };

  return {
    get,
    add,
  };
};
