const express = require("express");
const bodyParser = require("body-parser");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const usersController = require("./controller/users")();
const projectsController = require("./controller/projects")();
const issuesController = require("./controller/issues")();

const app = (module.exports = express());

//login
app.use((req, res, next) => {
  console.log("[%s] %s -- %s", new Date(), "Method: ", req.method, req.url);

  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(bodyParser.json());

////////////////////USERS
//get all users
app.get("/users", usersController.getController);
//add an user
app.post("/users", usersController.postController);
//get a user by email or user _id
app.get("/users/:id", usersController.getById);
//BONUS : Hash the password/key
//Use bcrypt to hash the password/key for the users

////////////////////PROJECTS
//get all projects
app.get("/projects", projectsController.getController);
//add an user
app.post("/projects", projectsController.postController);
//get a user  by slug or project _id
app.get("/projects/:id", projectsController.getById);

////////////////////ISSUES
//Get all issues (bring comments with it)
app.get("/issues", issuesController.getController);
//Get individual issues by issueNumber or issue _id
app.get("/issues/:id", issuesController.getByIdController);
//Get all issues for a project
app.get(
  "/projects/:slug/issues",
  issuesController.getIssuesByProjectController
);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// BONUS : Updated the status of an issue
app.put(
  "/projects/:slug/issues/:issue_id/:status",
  issuesController.putUpdateStatusController
);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//Add new issues to a project individually
app.post("/projects/:slug/issues", issuesController.postController);

////////////////////COMMENTS
//Get all comments (optional)
app.get("/comments/", issuesController.getAllCommentsController);
//Get all comments for an author (email)
app.get("/comments/:email", issuesController.getCommentsByEmailController);
//Get all comments for an issue
app.get("/issues/:issueNumber/comments", issuesController.getCommentController);
//Get individual comments for an issue
app.get(
  "/issues/:issueNumber/comments/:comment_id",
  issuesController.getCommentByIdController
);
//Add new comments to an issue
app.post(
  "/issues/:issueNumber/comments/",
  issuesController.postCommentController
);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  //console.log(process.env.MONGO_URI)
});

app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: "Route not found",
  });
});
