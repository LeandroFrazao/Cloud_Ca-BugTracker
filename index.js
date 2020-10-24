const express = require ('express');
const bodyParser = require('body-parser');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const usersController = require('./controller/users')();
const projectsController = require('./controller/projects')();
const issuesController = require('./controller/issues')();

//const users = require('./models')();

const app = module.exports = express();

//static page

//login
app.use((req, res, next)=>{
    console.log('[%s] %s -- %s', new Date(), 'Method: ', req.method, req.url );

    res.setHeader ('Content-Type', 'application/json');
    //req.setHeader('Content-Type', 'application/json');
    next();
});

app.use(bodyParser.json());

//get all users
app.get('/users', usersController.getController);
//add an user
app.post('/users', usersController.postController);
//get a user
app.get('/users/:id', usersController.getById);

//get all projects
app.get('/projects', projectsController.getController);
//add an user
app.post('/projects', projectsController.postController);
//get a user
app.get('/projects/:id', projectsController.getById);

//get all issues
app.get('/issues', issuesController.getController);
//add an issue
app.post('/issues', issuesController.postController);
//get a issue
app.get('/issues/:id', issuesController.getById);

//get comments
app.get('/issues/:issue/comments', issuesController.getCommentController);
//add a comment
app.post('/issues/:author/comments', issuesController.postCommentController);


app.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
    //console.log(process.env.MONGO_URI)
});

app.use((req, res)=>{
    res.status(404).json({
        error: 404,
        message: 'Route not found',
    });
    
});