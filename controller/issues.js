const issues = require("../models/issues")();

module.exports = () => {
  //////////////////////////////////////////////////////////////////////////////////
  ////Get all issues "{GET} /issues"///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  const getController = async (req, res) => {
    res.json(await issues.get());
  };

  ////////////////////////////////////////////////////////////////////////////////
  ////Get individual issues "{GET} /issues/{:issueNumber}" or {_id}//////////////
  //////////////////////////////////////////////////////////////////////////////
  const getByIdController = async (req, res) => {
    res.json(await issues.get(req.params.id));
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////Get all issues for a project "{GET} /projects/{projectSlug}/issues"///////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getIssuesByProjectController = async (req, res) => {
    const slug = req.params.slug;
    const result = await issues.getIssuesByProject(slug);
    res.json(result);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////BONUS : Updated the status of an issue "{PUT} /projects/{projectSlug}/issues/{ISSUE-ID}/{STATUS}"///
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const putUpdateStatusController = async (req, res) => {
    const slug = req.params.slug;
    const issue_id = req.params.issue_id;
    const status = req.params.status;
    result = await issues.putUpdateStatus(slug, issue_id, status);
    res.json(result);
  };

  //////////////////////////////////////////////////////////////////////////////////////////
  /////Add new issues to a project individually "{POST} /projects/BOOKS/issues"////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  const postController = async (req, res) => {
    const slug = req.params.slug;
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const result = await issues.add(slug, title, description, status);
    res.json(result);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////Get all comments "{GET} /comments" ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getAllCommentsController = async (req, res) => {
    res.json(await issues.getComments());
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  //////Get all comments for an author (email) "{GET} /comments/{EMAIL}"//////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getCommentsByEmailController = async (req, res) => {
    const email = req.params.email;
    const result = await issues.getComments(email);
    res.json(result);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  /////Get all comments for an issue "{GET} /issues/{ISSUE-ID}/comments"////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getCommentController = async (req, res) => {
    res.json(await issues.getComment(req.params.issueNumber));
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////Get individual comments for an issue "{GET} /issues/{ISSUE-ID}/comments/{COMMENT-ID}"//
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getCommentByIdController = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const comment_id = req.params.comment_id;
    res.json(await issues.getComment(issueNumber, comment_id));
  };
  ///////////////////////////////////////////////////////////////////////////////////////
  /////Add new comments to an issue "{POST} /issues/{ISSUE-ID}/comments"////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  const postCommentController = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const text = req.body.text;
    const email = req.body.author;
    const result = await issues.addComment(issueNumber, email, text);
    res.json(result);
  };

  return {
    getController,
    getByIdController,
    getIssuesByProjectController,
    putUpdateStatusController,
    postController,
    getAllCommentsController,
    getCommentsByEmailController,
    getCommentController,
    getCommentByIdController,
    postCommentController,
  };
};
