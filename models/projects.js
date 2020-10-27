const db = require("../db")();
const COLLECTION = "projects";
const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    console.log(" --- projectsModel.get --- ");
    // find document or using slug or project _id
    let projects = null;
    if (!id) {
      try {
        projects = await db.get(COLLECTION, {});
        if (projects.length == 0) {
          error = "There are no Projects Registered";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
      return projects;
    } else {
      try {
        if (ObjectID.isValid(id)) {
          //check if object is valid
          projects = await db.get(COLLECTION, { _id: ObjectID(id) }); //use objectid to get id from mongodb
        } else {
          const slug = id.toUpperCase();
          projects = await db.get(COLLECTION, { slug: slug });
        }
        if (projects.length == 0) {
          error = "Project Not Found!";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
    }

    return projects;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const add = async (slug, name, description) => {
    console.log(" --- projectsModel.add --- ");
    const results = await db.add(COLLECTION, {
      slug: slug.toUpperCase(),
      name: name,
      description: description,
    });
    return results.result;
  };

  return {
    get,
    add,
  };
};
