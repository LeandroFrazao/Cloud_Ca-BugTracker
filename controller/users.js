module.exports = () => {
    const users = require('../models/users')();

    const getController = async(req, res)=>{
        res.json(await users.get());
    };

    const getById = async(req, res) => {
        res.json(await users.get(req.params.id)); //Get by ID
    };

    const postController = async(req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const userType = req.body.userType;
        const result = await users.add(name,email,userType);
        res.json(result);
    };

return {
    getController,
    postController,
    getById,
}

}