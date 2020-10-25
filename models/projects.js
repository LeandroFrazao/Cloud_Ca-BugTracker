const db = require("../db")();
const COLLECTION = "projects";
const  ObjectID = require('mongodb').ObjectID;

module.exports = () => {
    const get = async(id = null)=>{ // find document or using slug or project _id 
        console.log('Inside Projects Model');
        var projects = null;
        if (!id) {
            try {
                projects = await db.get(COLLECTION, {});
            } catch (error) {
                error = "There no Projects Registered";
                return error;
            }
            return projects;
        } else {
            if (id.length < 10) { //suppose that the lenght of id is lower than 10 , we try to find using slug
                try {
                    const slug = id.toUpperCase();
                    projects = await db.get(COLLECTION, { "slug": slug});
                } catch (error) {
                    error = "Project Not Found!";
                    return error;
                }
            }
            if ( id.length > 10 || projects.length ==0 ){
                try {
                    projects = await db.get(COLLECTION, { "_id": ObjectID(id) });  //use objectid to get id from mongodb
                } catch (error) {
                    error = "Project Not Found!";
                    return error; 
                }
            }} 
        return projects;
    };

    const add = async(slug,name,description)=>{
        const results = await db.add(COLLECTION, {
            slug:slug, 
            name:name,
            description:description,
        });
        return results.result;
    }; 

    return {
        get,
        add,

    }
}