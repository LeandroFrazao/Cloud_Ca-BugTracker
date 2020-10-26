module.exports = () => {
  const issues = require("../models/issues")();

  const getController = async (req, res) => {
    res.json(await issues.get());
  };

  const getByIdController = async (req, res) => {
    res.json(await issues.get(req.params.id)); //can find using issue number or _id
  };

  const getIssuesByProjectController = async (req, res) => {
    const slug = req.params.slug;
    const result = await issues.getIssuesByProject(slug);
    res.json(result);
  };

  const postController = async (req, res) => {
    const slug = req.params.slug;
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const result = await issues.add(slug, title, description, status);
    res.json(result);
  };
  const getAllCommentsController = async (req, res) => {
    res.json(await issues.getComments());
  };
  const getCommentsByEmailController = async (req, res) => {
    const email = req.params.email;
    const result = await issues.getComments(email);
    res.json(result);
  };

  const getCommentController = async (req, res) => {
    res.json(await issues.getComment(req.params.issueNumber));
  };
  const getCommentByIdController = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const comment_id = req.params.comment_id;
    res.json(await issues.getComment(issueNumber, comment_id));
  };

  const postCommentController = async (req, res) => {
    const issueNumber = await req.params.issueNumber;
    const id_or_email = await req.params.author;
    const text = req.body.text;
    const result = await issues.addComment(issueNumber, id_or_email, text);
    res.json(result);
  };

  return {
    getController,
    getByIdController,
    getIssuesByProjectController,
    postController,
    getAllCommentsController,
    getCommentsByEmailController,
    getCommentController,
    getCommentByIdController,
    postCommentController,
  };
};
