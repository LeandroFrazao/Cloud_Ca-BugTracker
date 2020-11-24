//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\     Cloud Based Web Applications: CA Project Part 2                    \\\\\\\\\\\\\\\\\\\
//\\     Lecturer: Dave Albert                                              \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\     Student: Leandro Frazão                                            \\\\\\\\\\\\\\\\\\\
//\\     Studend Number: 2020094                                            \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\                                                          November,2020 \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const express = require("express");

const bodyParser = require("body-parser");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const usersController = require("./controller/users")();
const projectsController = require("./controller/projects")();
const issuesController = require("./controller/issues")();

const cookieParser = require("cookie-parser");
const app = express();

//login
app.use((req, res, next) => {
  console.log("[%s] %s -- %s", new Date(), "Method: ", req.method, req.url);
  next();
});
const { login } = require("./user/token");
//const { accessLevel } = require("./user/auth");
const { register, confirmation } = require("./user/register");

//variables are loaded with validator to be used on the routes.
const {
  validateLogin,
  validateUser,
  validateProject,
  validateIssues,
  validateComments,
} = require("./user/validator");
app.use(cookieParser());
app.use(bodyParser.json());

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       AUTHENTICATION                                   \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const { auth, accessLevel } = require("./user/auth");

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\     In Postman(or similar)                                           \\\\\\\\\\\\\\\\\\\
//\\     Request: {POST}"/login"                                          \\\\\\\\\\\\\\\\\\\
//\\     Body:                                                            \\\\\\\\\\\\\\\\\\\
//\\ USER-->   "email": "your email"                                      \\\\\\\\\\\\\\\\\\\
//\\ KEY-->    "key": "your password"                                     \\\\\\\\\\\\\\\\\\\
//\\                                                                      \\\\\\\\\\\\\\\\\\\
//\\    For demonstration/test purpose:                                   \\\\\\\\\\\\\\\\\\\
//\\  {  "email": "dalbert@cct.ie"                                        \\\\\\\\\\\\\\\\\\\
//\\    "key": "123456"   }                                               \\\\\\\\\\\\\\\\\\\
//\\                       (all users were registered with same password) \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       LOGIN                                            \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post("/login", validateLogin, login);
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       Register NEW USER                                \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.post("/register", validateUser, register);
app.get("/verify/:randomtoken", confirmation);
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       ROUTES                                           \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////////////////////////////////////////////
/////         USERS                                              ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> get all users
app.get("/users", auth, accessLevel, usersController.getController);
//------------> add an user
app.post(
  "/users",
  auth,
  accessLevel,
  validateUser,
  usersController.postController
);
//------------> get a user by email or user _id
app.get("/users/:id", auth, accessLevel, usersController.getById);

//////////////////////////////////////////////////////////////////////////////////
/////         PROJECTS                                           ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> get all projects
app.get("/projects", auth, projectsController.getController);
//add a project
app.post(
  "/projects",
  auth,
  validateProject,
  accessLevel,
  projectsController.postController
);
//------------> get a user  by slug or project _id
app.get("/projects/:id", auth, projectsController.getById);

//////////////////////////////////////////////////////////////////////////////////
/////         ISSUES                                             ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> Get all issues (bring comments with it)
app.get("/issues", auth, issuesController.getController);
//------------> Get individual issues by issueNumber or issue _id
app.get("/issues/:id", auth, issuesController.getByIdController);
//------------> Get all issues for a project
app.get(
  "/projects/:slug/issues",
  auth,
  issuesController.getIssuesByProjectController
);
///////////////////////////////////////////
// BONUS : Updated the status of an issue/
/////////////////////////////////////////
app.put(
  "/projects/:slug/issues/:issue_id/:status",
  auth,
  accessLevel,
  issuesController.putUpdateStatusController
);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//Add new issues to a project individually
app.post(
  "/projects/:slug/issues",
  auth,
  validateIssues,
  issuesController.postController
);

//////////////////////////////////////////////////////////////////////////////////
/////         COMMENTS                                           ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> Get all comments (optional)
app.get("/comments/", auth, issuesController.getAllCommentsController);
//------------> Get all comments for an author (email)
app.get(
  "/comments/:email",
  auth,
  issuesController.getCommentsByEmailController
);
//------------> Get all comments for an issue
app.get(
  "/issues/:issueNumber/comments",
  auth,
  issuesController.getCommentController
);
//------------> Get individual comments for an issue
app.get(
  "/issues/:issueNumber/comments/:comment_id",
  auth,
  issuesController.getCommentByIdController
);
//------------> Add new comments to an issue
app.post(
  "/issues/:issueNumber/comments/",
  auth,
  validateComments,
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
