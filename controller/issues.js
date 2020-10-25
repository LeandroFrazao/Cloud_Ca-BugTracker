module.exports = () => {
    const issues = require('../models/issues')();

    const getController = async(req, res)=>{
        res.json(await issues.get());
    };

    const getById = async(req, res) => {
        res.json(await issues.get(req.params.id)); //can find using issue number or _id
    };

    const postController = async(req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status;
        const result = await issues.add(slug,title, description, status);
        res.json(result);
    };
    
    const getCommentController = async (req, res) => {
        res.json(await issues.getComment(req.params.issue));
    }
    const getCommentByIdController = async (req, res) => {
        const issue = req.params.issue;
        const comment_id = req.params.comment_id;
        res.json(await issues.getComment(issue, comment_id));
    }
    const getIssuesByProjectController = async (req, res) => {
        const slug = req.params.slug;
        const result = await issues.getIssuesByProject(slug);
        res.json(result);
    }
    const postCommentController = async (req, res) => {
        const project_slug = await (req.params.issue);
        const id_or_email = await (req.params.author);
        const text = req.body.text;                    
        const result = await issues.addComment(project_slug, id_or_email, text);
        res.json(result);
    }

return {
    getController,
    postController,
    getById,
    getIssuesByProjectController,
    getCommentController,
    getCommentByIdController,
    postCommentController,
};

};