const db = require("../db")();
const userHashKey = require("../user/hash")(); //BONUS : Hash the password/key
const COLLECTION = "users";
const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  ///////////////////////////////////////////////////////////////////////////
  /////Get all users "{GET} /users"/////////////////////////////////////////
  ////Or                           ////////////////////////////////////////
  /////Get individual users "{GET} /users/{EMAIL}" or { _id}//////////////
  ///////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    console.log(" --- usersModel.get --- ");
    var users = null; //initialize variable

    try {
      if (!id) {
        // check if id is null or empty
        users = await db.get(COLLECTION);
        if (users.length == 0) {
          error = "No Users Registered";
          return { error: error };
        }
      } else {
        const email = id.toLowerCase();
        if (ObjectID.isValid(id)) {
          //check if object is valid
          PIPELINE_ID_OBJECT_OR_EMAIL = {
            //if objectID(id) is valid, so the query is going to try to find BOTH _id or SLUG
            $or: [{ _id: ObjectID(id) }, { email: email }],
          };
          users = await db.get(COLLECTION, PIPELINE_ID_OBJECT_OR_EMAIL); //first try to find using _id, if it returns empty array, then try by email
        } else {
          users = await db.get(COLLECTION, { email: id.toLowerCase() }); //use objectid to get id from mongodb
        }
        if (users.length == 0) {
          error = "User not Found!";
          return { error: error };
        }
        // console.log("Compare Key and HashKey, result is: " await userHashKey.compare("123456", users[0].key));  //to check hashKey
      }
      return users;
    } catch (error) {
      return { error: error };
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////
  ////Add new users individually "{POST} /users"///////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const add = async (name, email, userType, key) => {
    console.log(" --- usersModel.add --- ");
    try {
      if (!name || !email || !userType || !key) {
        // check if all fields are not null, undefined or empty.
        error =
          "Fields name:(" +
          name +
          "), email:(" +
          email +
          "), userType:(" +
          userType +
          ") or key, MUST NOT BE EMPTY or UNDEFINED";
        return { error: error };
      }
      if (
        // check if the userType is valid according to the parameters bellow.
        userType != "user" &&
        userType != "admin"
      ) {
        error = "Invalid User Type (" + userType + "). MUST BE: user or admin.";
        return { error: error };
      }

      if (email.length < 5) {
        // a@a.a minimum length required for email is 5 characters
        error = "Email (" + email + ") is invalid";
        return { error: error };
      }

      if (key.length < 6) {
        //  minimum length required for key is 6 characters
        error = "Key length (" + key.length + ") must be greater than 5";
        return { error: error };
      }
      //check if email was already registered
      email = email.toLowerCase();
      const users = await db.get(COLLECTION, { email: email }); //use objectid to get id from mongodb

      if (users.length > 0) {
        error = "Email (" + email + ") is already being Used.";
        return { error: error };
      }
      //BONUS : Hash the password/key
      let hashKey = await userHashKey.hash(key); // call a function to hash the user key
      const results = await db.add(COLLECTION, {
        name: name,
        email: email.toLowerCase(),
        userType: userType.toLowerCase(),
        key: hashKey,
      });
      return results.result;
    } catch (error) {
      return { error: error };
    }
  };

  return {
    get,
    add,
  };
};
