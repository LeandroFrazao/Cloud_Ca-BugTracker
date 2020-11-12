const db = require("../db")();
const COLLECTION = "projects";
const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  //////////////////////////////////////////////////////////////////////////////////////
  ///Get all projects "{GET} /projects"////////////////////////////////////////////////
  ///Or                               ////////////////////////////////////////////////
  ///Get individual projects "{GET} /projects/{SLUG}" or {_id}///////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    console.log(" --- projectsModel.get --- ");
    // find document or using slug or project _id
    let projects = null;
    try {
      if (!id) {
        projects = await db.get(COLLECTION, {});
        if (projects.length == 0) {
          error = "There are no Projects Registered";
          return { error: error };
        }
        return { result: projects };
      } else {
        const slug = id.toUpperCase();
        if (ObjectID.isValid(id)) {
          //check if object is valid
          PIPELINE_ID_OBJECT_OR_SLUG = {
            //if objectID(id) is valid, so the query is going to try to find BOTH _id or SLUG
            $or: [{ _id: ObjectID(id) }, { slug: slug }],
          };
          projects = await db.get(COLLECTION, PIPELINE_ID_OBJECT_OR_SLUG); //use objectid to get id from mongodb
        } else {
          projects = await db.get(COLLECTION, { slug: slug });
        }
        if (projects.length == 0) {
          error = "Project (" + id + ") Not Found!";
          return { error: error };
        }
        return { result: projects };
      }
    } catch (error) {
      return { error: error };
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////
  ///Add new Projects individually "{POST} /projects"//////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const add = async (slug, name, description) => {
    console.log(" --- projectsModel.add --- ");
    try {
      slug = slug.toUpperCase();
      const project = await db.get(COLLECTION, { slug: slug });
      if (project.length > 0) {
        error = "Slug (" + slug + ") is already being used.";
        return { error: error };
      }
      const results = await db.add(COLLECTION, {
        slug: slug,
        name: name,
        description: description,
      });
      return { result: results.result };
    } catch (error) {
      return { error: error };
    }
  };

  return {
    get,
    add,
  };
};
