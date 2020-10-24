module.exports = () => {
    const projects = require('../models/projects')();

    const getController = async(req, res)=>{
        res.json(await projects.get());
    };

    const getById = async(req, res) => {
        res.json(await projects.get(req.params.id));
    };

    const postController = async(req, res) => {
        const slug = req.body.slug.toUpperCase(); //convert string to UpperCase
        const name = req.body.name;
        const description = req.body.description;
        const result = await projects.add(slug,name,description);
        res.json(result);
    };

return {
    getController,
    postController,
    getById,
}

}