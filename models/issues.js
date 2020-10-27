const db = require("../db")();
const COLLECTION = "issues";

const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  //////////////////////////////////////////////////////////////////////////////////
  ////Get all issues "{GET} /issues"///////////////////////////////////////////////
  ////Or                                    //////////////////////////////////////
  ////Get individual issues "{GET} /issues/{:issueNumber}" or {_id}//////////////
  //////////////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    // find document or using issueNumber or issues _id
    console.log(" --- issuesModel.get --- ");
    let issues = null;
    try {
      if (!id) {
        issues = await db.get(COLLECTION);
        if (!issues[0]) {
          error = "There are no Issues Registered";
          return { error: error };
        }
      } else {
        // if user use issue _id instead of slug,
        const issuenum = id.toUpperCase();
        if (ObjectID.isValid(id)) {
          console.log(id);
          //check if object is valid
          PIPELINE_ID_OBJECT_OR_ISSUENUMBER = {
            //if objectID(id) is valid, so the query is going to try to find BOTH _id or IssueNumber
            $or: [{ _id: ObjectID(id) }, { issueNumber: issuenum }],
          };
          issues = await db.get(COLLECTION, PIPELINE_ID_OBJECT_OR_ISSUENUMBER);
        } else {
          //or use query to find issueNumber from mongodb
          issues = await db.get(COLLECTION, { issueNumber: issuenum });
        }
        if (!issues[0]) {
          // if query returns undefined means that there's no issue registered
          error = "There is no Issue (" + id + ") Registered";
          return { error: error };
        }
      }
    } catch (error) {
      return { error: error };
    }
    return issues;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////Get all issues for a project "{GET} /projects/{projectSlug}/issues"///////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const getIssuesByProject = async (slug) => {
    console.log(" --- issuesModel.getIssuesByProject --- ");
    try {
      slug = slug.toUpperCase();
      const PIPELINE_SLUG_ISSUES = [
        {
          $lookup: {
            from: "issues",
            localField: "_id",
            foreignField: "project_id",
            as: "issue",
          },
        },
        { $match: { slug: slug } },
      ];

      const issues = await db.aggregate("projects", PIPELINE_SLUG_ISSUES);
      if (!issues[0]) {
        error = "Slug (" + slug + ") NOT FOUND!";
        return { error: error };
      }
      if (issues[0].issue.length == 0) {
        error = "Issues for slug (" + slug + ") NOT FOUND!";
        return { error: error };
      }
      return issues;
    } catch (error) {
      return { error: error };
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////BONUS : Updated the status of an issue "{PUT} /projects/{projectSlug}/issues/{ISSUE-ID}/{STATUS}"///
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const putUpdateStatus = async (slug, issue_id, status) => {
    console.log(" --- issuesModel.putUpdateStatus --- ");
    try {
      if (
        status != "open" &&
        status != "wip" &&
        status != "blocked" &&
        status != "closed"
      ) {
        error =
          "Invalid Status (" +
          status +
          "). Must Be: open, wip, blocked or closed";
        return { error: error };
      }
      slug = slug.toUpperCase();
      const issueNumber = slug + "-" + issue_id;
      let issue = null;

      const project = await db.get("projects", { slug: slug });

      if (!project[0]) {
        error = "Slug (" + slug + ") NOT FOUND!";
        return { error: error };
      }

      issue = await db.get(COLLECTION, { issueNumber: issueNumber });
      if (!issue[0]) {
        error = "Issue ID (" + issue_id + ") NOT FOUND!";
        return { error: error };
      }
      const newValue = { $set: { status: status } };
      const projects = await db.update(COLLECTION, { issueNumber }, newValue);
      return projects;
    } catch (error) {
      return { error: error };
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////
  /////Add new issues to a project individually "{POST} /projects/BOOKS/issues"////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  const add = async (slug, title, description, status) => {
    console.log(" --- issuesModel.add --- ");

    try {
      if (!title || !description || !status) {
        // check if all fields are not null, undefined or empty.
        error =
          "Fields title:(" +
          title +
          "), description:(" +
          description +
          "), status:(" +
          status +
          "), MUST NOT BE EMPTY or UNDEFINED!";
        return { error: error };
      }
      if (
        // check iff the status is valid according to the parameters bellow.
        status != "open" &&
        status != "wip" &&
        status != "blocked" &&
        status != "closed"
      ) {
        error =
          "Invalid Status (" +
          status +
          "). Must Be: open, wip, blocked or closed";
        return { error: error };
      }
      slug = slug.toUpperCase();
      let project = null;
      project = await db.get("projects", { slug: slug });
      if (project.length == 0) {
        error = "Slug (" + slug + ") NOT FOUND!";
        return { error: error };
      }
      // count number of projects with same id
      const PIPELINE_COUNT_PROJECTS_ISSUES = [
        { $match: { project_id: ObjectID(project[0]._id) } },
        { $count: "project_id" },
      ];
      const count_projects = await db.aggregate(
        COLLECTION,
        PIPELINE_COUNT_PROJECTS_ISSUES
      );
      let id_slug = null;
      if (!count_projects[0]) {
        // If the project has an issue for the first time
        id_slug = 1;
      } else {
        id_slug = count_projects[0].project_id + 1;
      }
      const results = await db.add(COLLECTION, {
        issueNumber: slug.toUpperCase() + "-" + id_slug,
        title: title,
        description: description,
        status: status,
        project_id: project[0]._id,
        comments: [],
      });
      return results.result;
    } catch (error) {
      return { error: error };
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////Get all comments "{GET} /comments" ////////////////////////////////////////////////////
  //////Or                             ////////////////////////////////////////////////////////
  //////Get all comments for an author (email) "{GET} /comments/{EMAIL}" /////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getComments = async (email = null) => {
    console.log(" --- issuesModel.getComments --- ");
    const PIPELINE_ALL_COMMENTS = [
      { $match: { "comments.id": 1 } },
      {
        $project: {
          _id: 0,
          issueNumber: 1,
          comments: 1,
        },
      },
    ];
    try {
      if (email) {
        const PIPELINE_COMMENTS_BY_EMAIL = [
          { $match: { "comments.author": email.toLowerCase() } },
          {
            $project: {
              _id: 0,
              issueNumber: 1,
              comments: {
                $filter: {
                  input: "$comments",
                  as: "comment",
                  cond: { $eq: ["$$comment.author", email.toLowerCase()] },
                },
              },
            },
          },
        ];

        const results = await db.aggregate(
          COLLECTION,
          PIPELINE_COMMENTS_BY_EMAIL
        );
        if (results.length == 0) {
          error = "Email (" + email + ") NOT FOUND!";
          return { error: error };
        }
        return results;
      } else {
        const results = await db.aggregate(COLLECTION, PIPELINE_ALL_COMMENTS);
        if (results.length == 0) {
          error = "There are no Comments Registered";
          return { error: error };
        }
        return results;
      }
    } catch (error) {
      return { error: error };
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  /////Get all comments for an issue "{GET} /issues/{ISSUE-ID}/comments"////////////////////////
  ////// Or                                     ///////////////////////////////////////////////
  /////Get individual comments for an issue "{GET} /issues/{ISSUE-ID}/comments/{COMMENT-ID}"//
  ///////////////////////////////////////////////////////////////////////////////////////////
  const getComment = async (issueNumber = null, comment_id = null) => {
    console.log(" --- issuesModel.getComment --- ");
    let issues;
    try {
      issues = await db.get(COLLECTION, {
        issueNumber: issueNumber.toUpperCase(),
      });

      if (!issues[0]) {
        error = "IssueNumber (" + issueNumber + ") NOT FOUND!";
        return { error: error };
      }

      if (!comment_id) {
        if (issues[0].comments.length != 0) {
          return issues[0].comments;
        } else {
          error =
            "There are NO COMMENTS on IssuenNumber (" +
            issueNumber.toUpperCase() +
            ")";
          return { error: error };
        }
      } else if (comment_id) {
        PIPELINE_COMMENT_ID = [
          { $match: { issueNumber: issueNumber.toUpperCase() } },
          {
            $project: {
              _id: 1,
              title: 1,
              issueNumber: 1,
              description: 1,
              status: 1,
              project_id: 1,
              comments: {
                $filter: {
                  input: "$comments",
                  as: "comment",
                  cond: { $eq: ["$$comment.id", parseInt(comment_id)] },
                },
              },
            },
          },
        ];

        const comment = await db.aggregate(COLLECTION, PIPELINE_COMMENT_ID);
        if (comment[0].comments.length != 0) {
          return comment;
        } else {
          error = "Issue with Comment ID (" + comment_id + ") NOT FOUND!";
          return { error: error };
        }
      }
    } catch (error) {
      return { error: error };
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////Add new comments to an issue "{POST} /issues/BOOK-1/comments"////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const addComment = async (issueNumber, email, text) => {
    console.log(" --- issuesModel.addComment --- ");
    let author = null;
    try {
      if (!email || !text) {
        // check if all fields are not null, undefined or empty.
        error =
          "Fields email:(" +
          email +
          "), text:(" +
          text +
          "), MUST NOT BE EMPTY or UNDEFINED!";
        return { error: error };
      }
      const authoremail = await db.get("users", { email: email });
      author = authoremail;

      if (author.length == 0) {
        error = "User (" + id_or_email + ") NOT FOUND!";
        return { error: error };
      }

      let count = 0;
      const PIPELINE_COUNT_PROJECT_COMMENTS = [
        { $match: { issueNumber: issueNumber.toUpperCase() } },
        {
          $project: {
            _id: false,
            item: 1,
            counter: {
              $cond: {
                if: { $isArray: "$comments" },
                then: { $size: "$comments" },
                else: "0",
              },
            },
          },
        },
      ];

      const count_comments = await db.aggregate(
        COLLECTION,
        PIPELINE_COUNT_PROJECT_COMMENTS
      );
      if (count_comments[0]) {
        // if  was found the project, then count_comments is not undefined.
        count = count_comments[0].counter + 1;
      } else {
        error = "IssueNumber (" + issueNumber + ") NOT FOUND!";
        return { error: error };
      }
      const comments = {
        id: count,
        text: text,
        author: author[0].email,
      };
      const results = await db.update(
        COLLECTION,
        { issueNumber: issueNumber.toUpperCase() },
        {
          $push: { comments: comments },
        }
      );
      return results.result;
    } catch (error) {
      return { error: error };
    }
  };

  return {
    get,
    getIssuesByProject,
    putUpdateStatus,
    add,
    getComments,
    getComment,
    addComment,
  };
};
