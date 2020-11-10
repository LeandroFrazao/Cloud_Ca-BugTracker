const issues = require("../models/issues")();

module.exports = () => {
  //////////////////////////////////////////////////////////////////////////////////
  ////Get all issues "{GET} /issues"///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  const getController = async (req, res) => {
    const { result, error } = await issues.get();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  ////////////////////////////////////////////////////////////////////////////////
  ////Get individual issues "{GET} /issues/{:issueNumber}" or {_id}//////////////
  //////////////////////////////////////////////////////////////////////////////
  const getByIdController = async (req, res) => {
    const { result, error } = await issues.get(req.params.id);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////Get all issues for a project "{GET} /projects/{projectSlug}/issues"///////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getIssuesByProjectController = async (req, res) => {
    const slug = req.params.slug;
    const { result, error } = await issues.getIssuesByProject(slug);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////BONUS : Updated the status of an issue "{PUT} /projects/{projectSlug}/issues/{ISSUE-ID}/{STATUS}"///
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const putUpdateStatusController = async (req, res) => {
    const slug = req.params.slug;
    const issue_id = req.params.issue_id;
    const status = req.params.status;
    const { result, error } = await issues.putUpdateStatus(
      slug,
      issue_id,
      status
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  //////////////////////////////////////////////////////////////////////////////////////////
  /////Add new issues to a project individually "{POST} /projects/{Slug}/issues"////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  const postController = async (req, res) => {
    const slug = req.params.slug;
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    const { result, error } = await issues.add(
      slug,
      title,
      description,
      status
    );
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////Get all comments "{GET} /comments" ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getAllCommentsController = async (req, res) => {
    const { result, error } = await issues.getComments();
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  //////Get all comments for an author (email) "{GET} /comments/{EMAIL}"//////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getCommentsByEmailController = async (req, res) => {
    const email = req.params.email;
    const { result, error } = await issues.getComments(email);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  /////Get all comments for an issue "{GET} /issues/{ISSUE-ID}/comments"////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getCommentController = async (req, res) => {
    const { result, error } = await issues.getComment(req.params.issueNumber);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////Get individual comments for an issue "{GET} /issues/{ISSUE-ID}/comments/{COMMENT-ID}"//
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getCommentByIdController = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const comment_id = req.params.comment_id;
    const { result, error } = await issues.getComment(issueNumber, comment_id);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
  };
  ///////////////////////////////////////////////////////////////////////////////////////
  /////Add new comments to an issue "{POST} /issues/{ISSUE-ID}/comments"////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  const postCommentController = async (req, res) => {
    const issueNumber = req.params.issueNumber;
    const text = req.body.text;
    const email = req.body.email;
    const { result, error } = await issues.addComment(issueNumber, email, text);
    if (error) {
      return res.status(500).json({ error });
    }
    res.json({ issues: result });
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
