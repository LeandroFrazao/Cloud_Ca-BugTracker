# CBWA-PROJECT-BUGTRACKER-CA2
> To develop a cloud web application using NodeJS. 

## Table of contents
* [What your project does](#what-your-project-does)
* [How to set it up](#how-to-set-it-up)
* [Technologies used](#technologies-used)
* [Example usage](#example-usage)
* [Changelog](#changelog)
* [Roadmap](#roadmap)
* [Author info](#author-info)

## What your project does
This project has the purpose of register bugs or issues in applications. It is possible to register users, new projects, and issues. Users can comment the issues. Also the admin can change the status of issues.

## How to set it up
Fisrt, you need to clone the project with the command
```ruby
$ git clone https://github.com/LeandroFrazao/Cloud_Ca-BugTracker.git
```

Then it is necessary to install the dependencies used in the project, so run the command:
```ruby
$ npm install
```
Mongo Seetings
1. Create an account in [Mongo-Atlas](https://www.mongodb.com/cloud/atlas)

2. Follow the [instructions] (https://docs.atlas.mongodb.com/getting-started/)

3. It is optional to install [Robo3T](https://robomongo.org/)

4. Follow the [instructions] (https://docs.atlas.mongodb.com/getting-started/) https://studio3t.com/knowledge-base/articles/connect-to-mongodb/)

5. It is necessary to set the enviroment variable in terminal, which contains information about your mongoDB, allowing to user the apllication and connect to your database locally.
$env:MONGO_URI="mongodb+srv://admin:<password>@cluster0.vfgmc.mongodb.net/<dbname>?retryWrites=true&w=majority"

7. Create an account in [Heroku](https://www.heroku.com/)

8. Follow the [instructions] (https://devcenter.heroku.com/articles/getting-started-with-nodejs)

9. Connection heroku to your mongoDB, follow the [instructions] (https://devcenter.heroku.com/articles/mongolab#connecting-to-your-mongodb-instance)
  

## Technologies used
* Nodemon
* Express
* JWT
* Crypto
* Cookie-parser
* MongoDB
* Robo3T
* Heroku

## Example usage
The demonstration of all the routes and more details can be accessed in this [file] (./BugTrack_Routes_Details_112020.pdf)

## Changelog
* 21th of October 2020 - Project for Cloud Based Web Applications is created.
* 24th of October 2020 - Connection with MongoDB is implemented.
* 24th of October 2020 - Routers and models of projects, issues and users are implemented.
* 24nd of October 2020 - Added functions Aggregate, Post, Get, Update and Count.
* 26th of october 2020 - Error checking is implemented.
* 28nd of October 2020 - Authenthication is implemented.
* 10th of November 2020 - Error checking is improved.

## Roadmap
* Mobile User interface (Jan 2020)

## Author info
Cloud Developer: Leandro Frazão
College name: CCT
Course title: Science in Computing



