module.exports = () => {
    const issues = require('../models/issues')();

    const getController = async(req, res)=>{
        res.json(await issues.get());
    };

    const getById = async(req, res) => {
        res.json(await issues.get(req.params.id));
    };

    const postController = async(req, res) => {
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status;
        const project_id = req.body.project_id;
        const comments = []
        const result = await issues.add(title, description, status, project_id, comments);
        res.json(result);
    };
    
    const getCommentController = async (req, res) => {
        res.json(await issues.getComment(req.params.issue));
    }
    const postCommentController = async (req, res) => {
        const id_or_email = await (req.params.author);
        const text = req.body.text;
        const author = req.body.author;
                    
        const result = await issues.addComment(id_or_email, text, author);
        res.json(result);
    }

return {
    getController,
    postController,
    getById,
    getCommentController,
    postCommentController,
};

};