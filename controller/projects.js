module.exports = () => {
  const projects = require("../models/projects")();

  //////////////////////////////////////////////////////////////////////////////////////
  ///Get all projects "{GET} /projects"////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  const getController = async (req, res) => {
    const { result, error } = await projects.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: result });
  };

  ////////////////////////////////////////////////////////////////////////////////////
  ///Get individual projects "{GET} /projects/{SLUG}" or {_id}///////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  const getById = async (req, res) => {
    const { result, error } = await projects.get(req.params.id);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: result });
  };

  //////////////////////////////////////////////////////////////////////////////////////
  ///Add new Projects individually "{POST} /projects"//////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const postController = async (req, res) => {
    const slug = req.body.slug;
    const name = req.body.name;
    const description = req.body.description;
    const { result, error } = await projects.add(slug, name, description);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ projects: result });
  };

  return {
    getController,
    postController,
    getById,
  };
};
