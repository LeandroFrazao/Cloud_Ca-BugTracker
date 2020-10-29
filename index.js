//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\     Cloud Based Web Applications: CA Project Part 1                    \\\\\\\\\\\\\\\\\\\
//\\     Lecturer: Dave Albert                                              \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\     Student: Leandro Frazão                                            \\\\\\\\\\\\\\\\\\\
//\\     Studend Number: 2020094                                            \\\\\\\\\\\\\\\\\\\
//\\                                                                        \\\\\\\\\\\\\\\\\\\
//\\                                                           October,2020 \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const express = require("express");
const bodyParser = require("body-parser");

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const usersController = require("./controller/users")();
const projectsController = require("./controller/projects")();
const issuesController = require("./controller/issues")();
const user = require("./user/user")();

const app = (module.exports = express());

//login
app.use((req, res, next) => {
  console.log("[%s] %s -- %s", new Date(), "Method: ", req.method, req.url);

  //  res.setHeader("Content-Type", "application/json");
  next();
});

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       AUTHENTICATION                                   \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const auth = require("./user/auth");
/*app.use(async (req, res, next) => {
  const FailedAuthMessage = {
    error: "Failed Authentication",
    message: "Unauthorized",
    code: "xxx",
  };

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //\\     In Postman(or similar) Headers                                   \\\\\\\\\\\\\\\\\\\
  //\\ USER-->    define key: x-api-user     Value: your email              \\\\\\\\\\\\\\\\\\\
  //\\ KEY-->    define key: x-api-key     Value: your password             \\\\\\\\\\\\\\\\\\\
  //\\                                                                      \\\\\\\\\\\\\\\\\\\
  //\\    For demonstration/test purpose:                                   \\\\\\\\\\\\\\\\\\\
  //\\    email:dalbert@cct.ie                                              \\\\\\\\\\\\\\\\\\\
  //\\    Password: 123456   (all users were registered with same password) \\\\\\\\\\\\\\\\\\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const suppliedUser = req.headers["x-api-user"];
  req.headers["x-fowarded-for"] || req.connection.remoteAddress;
  const suppliedKey = req.headers["x-api-key"];
  req.headers["x-fowarded-for"] || req.connection.remoteAddress;

  //check pre-shared key
  if (!suppliedKey || !suppliedUser) {
    console.log(
      "[%s] Failed Authentication -- %s, No Key Supplied",
      new Date(),
      suppliedUser
    );
    FailedAuthMessage.code = "1";
    return res.status(401).json(FailedAuthMessage);
  }

  const userKey = await user.getByUserKey(suppliedUser, suppliedKey);
  if (!userKey) {
    console.log(
      " [%s] Failed Authentication -- %s, BAD Key Supplied",
      new Date(),
      suppliedUser
    );
    FailedAuthMessage.code = "2";
    return res.status(401).json(FailedAuthMessage);
  }
  next();
});
*/

app.use(bodyParser.json());

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\                       ROUTES                                           \\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////////////////////////////////////////////
/////         USERS                                              ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> get all users
app.get("/users", auth, usersController.getController);
//------------> add an user
app.post("/users", auth, usersController.postController);
//------------> get a user by email or user _id
app.get("/users/:id", auth, usersController.getById);

//////////////////////////////////////////////////////////////////////////////////
/////         PROJECTS                                           ////////////////
////////////////////////////////////////////////////////////////////////////////
//------------> get all projects
app.get("/projects", auth, projectsController.getController);
//add an user
app.post("/projects", auth, projectsController.postController);
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
  issuesController.putUpdateStatusController
);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//Add new issues to a project individually
app.post("/projects/:slug/issues", auth, issuesController.postController);

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
