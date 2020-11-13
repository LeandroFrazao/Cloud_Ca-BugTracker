module.exports = () => {
  const users = require("../models/users")();

  ///////////////////////////////////////////////////////////////////////////
  /////Get all users "{GET} /users"/////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  const getController = async (req, res) => {
    const { result, error } = await users.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ users: result });
  };
  /////////////////////////////////////////////////////////////////////////
  /////Get individual users "{GET} /users/{EMAIL}" or { _id}//////////////
  ///////////////////////////////////////////////////////////////////////
  const getById = async (req, res) => {
    const { result, error } = await users.get(req.params.id);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ users: result });
  };

  //////////////////////////////////////////////////////////////////////////////////////
  ////Add new users individually "{POST} /users"///////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const postController = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const userType = req.body.userType;
    const key = req.body.key;
    const { result, error } = await users.add(name, email, userType, key);
    if (error) {
      return res.status(500).json({ error });
    }

    res.json({ users: result });
  };

  return {
    getController,
    postController,
    getById,
  };
};
