const db = require("../db")();
const COLLECTION = "issues";

const ObjectID = require("mongodb").ObjectID;

module.exports = () => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const get = async (id = null) => {
    // find document or using issueNumber or issues _id
    console.log(" --- issuesModel.get --- ");
    let issues = null;
    if (!id) {
      try {
        issues = await db.get(COLLECTION);
        if (issues[0] == undefined) {
          error = "There are no Issues Registered";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
    } else {
      try {
        // if user use issue _id instead of slug,
        if (ObjectID.isValid(id)) {
          issues = await db.get(COLLECTION, { _id: ObjectID(id) }); //use query find issue _id from mongodb
        } else {
          const issuenum = id.toUpperCase(); //or use query to find issueNumber from mongodb
          issues = await db.get(COLLECTION, { issueNumber: issuenum });
        }
        if (issues[0] == undefined) {
          // if query returns undefined means that there's no issue registered
          error = "There is no Issue (" + id + ") Registered";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
    }
    return issues;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const getIssuesByProject = async (slug) => {
    console.log(" --- issuesModel.getIssuesByProject --- ");
    try {
      const PIPELINE_SLUG_ISSUES = [
        {
          $lookup: {
            from: "issues",
            localField: "_id",
            foreignField: "project_id",
            as: "issue",
          },
        },
        { $match: { slug: slug.toUpperCase() } },
      ];

      const issues = await db.aggregate("projects", PIPELINE_SLUG_ISSUES);
      if (issues[0] == undefined) {
        error = "Slug (" + slug + ") Not Found";
        return { error: error };
      }
      return issues;
    } catch (error) {
      return { error: error };
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const putUpdateStatus = async (slug, issue_id, status) => {
    console.log(" --- issuesModel.putUpdateStatus --- ");
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
    const issueNumber = slug + "-" + issue_id;
    let issue = null;
    const PIPELINE_PROJECT_ISSUENUMBER = [];
    try {
      const project = await db.get("projects", { slug: slug });

      if (project[0] == undefined) {
        error = "Slug (" + slug + ") Not Found";
        return { error: error };
      }

      issue = await db.get(COLLECTION, { issueNumber: issueNumber });

      if (issue[0] == undefined) {
        error = "Issue ID (" + issue_id + ") Not Found";
        return error;
      }
      const project_id = issue[0].project_id;
      const newValue = { $set: { status: status } };
      const projects = await db.update(COLLECTION, { project_id }, newValue);
      return projects;
    } catch (error) {
      return { error: error };
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const add = async (slug, title, description, status) => {
    console.log(" --- issuesModel.add --- ");

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

    let project;
    let id_slug = null;
    project = await db.get("projects", { slug: slug.toUpperCase() });
    if (project.length == 0) {
      error = "Slug (" + slug + ") Not Found";
      return { error: error };
    }
    try {
      // count number of projects with same id
      const PIPELINE_COUNT_PROJECTS_ISSUES = [
        { $match: { project_id: ObjectID(project[0]._id) } },
        { $count: "project_id" },
      ];
      const count_projects = await db.aggregate(
        COLLECTION,
        PIPELINE_COUNT_PROJECTS_ISSUES
      );
      id_slug = count_projects[0].project_id + 1;
    } catch (error) {
      id_slug = 1; // the project has an issue for the first time
    }
    try {
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////
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

    if (email != null) {
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
      try {
        const results = await db.aggregate(
          COLLECTION,
          PIPELINE_COMMENTS_BY_EMAIL
        );
        return results;
      } catch (error) {
        error = "Email (" + email + ") Not Found";
        return { error: error };
      }
    } else {
      try {
        const results = await db.aggregate(COLLECTION, PIPELINE_ALL_COMMENTS);
        return results;
      } catch (error) {
        return { error: error };
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const getComment = async (issueNumber = null, comment_id = null) => {
    console.log(" --- issuesModel.getComment --- ");
    let issues;
    try {
      issues = await db.get(COLLECTION, {
        issueNumber: issueNumber.toUpperCase(),
      });
    } catch (error) {
      return { error: error };
    }
    if (issues[0] == undefined) {
      error = "IssueNumber (" + issueNumber + ") Not Found";
      return { error: error };
    }

    if (comment_id == null) {
      if (issues[0].comments.length != 0) {
        return issues[0].comments;
      } else {
        error = "There are NO Comments on IssuenNumber (" + issueNumber + ")";
        return { error: error };
      }
    } else if (comment_id != null) {
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

      try {
        const comment = await db.aggregate(COLLECTION, PIPELINE_COMMENT_ID);
        if (comment[0].comments.length != 0) {
          return comment;
        } else {
          error = "Issue with Comment ID (" + comment_id + ") Not Found";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const addComment = async (issueNumber, id_or_email, text) => {
    console.log(" --- issuesModel.addComment --- ");
    let author = null;
    try {
      const authorid = await db.get("users", { _id: ObjectID(id_or_email) }); //first try if id_or_email is a valid user _id.
      author = authorid;
    } catch (error) {
      author = null;
    }
    if (author == null || author[0] == undefined) {
      // only executes the if block bellow if query returned an error.
      try {
        const authoremail = await db.get("users", { email: id_or_email }); // if is not an id, then try with email,
        author = authoremail;
        if (author[0] == undefined) {
          error = "User (" + id_or_email + ") Not Found";
          return { error: error };
        }
      } catch (error) {
        return { error: error };
      }
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

    try {
      const count_comments = await db.aggregate(
        COLLECTION,
        PIPELINE_COUNT_PROJECT_COMMENTS
      );
      if (count_comments[0] != undefined) {
        // if  was found the project, then count_comments is not undefined.
        count = count_comments[0].counter + 1;
      } else {
        error = "IssueNumber (" + issueNumber + ") Not Found";
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
