const db = require("../db")();
const COLLECTION = "users";
const  ObjectID = require('mongodb').ObjectID;

module.exports = () => {
    const get = async(id = null)=>{
        console.log('Inside Users Model');
        var users = null; //initialize variable
        if (!id) {  // check if id is null
           try {
                users = await db.get(COLLECTION); 
                console.log(users);
            } catch (error) {
                error = "No Users Registered";
                return error;
            }}
        else {
            try {  //first try to find using _id, if it returns empty array, then try by email
                users = await db.get(COLLECTION, { _id: ObjectID(id) }); //use objectid to get id from mongodb                
                if (users.length == 0)
                    users = await db.get(COLLECTION, { email: id.toLowerCase() }); //use objectid to get id from mongodb                
         
            } catch (error) {
                error = "User not Found!";
                return error;
            }}
        return users;
    };

    const add = async(name,email, userType)=>{
        const results = await db.add(COLLECTION, {
            name:name,
            email:email,
            userType:userType,
        });
        return results.result;
    }; 


    return {
        get,
        add,

    }
}