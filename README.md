# Cloud_Ca-BugTracker
Ca of Cloud Development- Dave
Functional Requirements:
● Projects
○ Get all projects
○ Get individual projects
○ Add new projects individually
● Users
○ Get all users
○ Get individual users
○ Add new users individually
● Issues
○ Get all issues
○ Get all issues for a project
○ Get individual issues
○ BONUS: Updated the status of an issue
○ Add new issues to a project individually
○ Issues have Comments
■ Get all comments for an issues
■ Get individual comments for an issues
■ Add new comments to an issue
Technical Requirements:
● Use nodejs
● Use expressjs
● Use mongodb on Atlas
● Deployed on Heroku
● Code in Github
Submission
1. Link to GitHub Repository
2. Link to Heroku

Details
Projects
_id: Automatic from Mongo
slug: Capitals A-Z (like BOOK or BUG)
name: string
description: string
Users
_id: Automatic from Mongo
name: string
email: string
usertype: string
Issues/Comments
_id: Automatic from Mongo
issueNumber: The slug plus an automatic number based on the count of items at issue
creation (BOOK-1, BOOK-2, BUG-1, BUG-2)
title: string
description: string
status: string { todo, wip, blocked, closed }
Project_ID: ObjectId of the project "_id" : ObjectId("5f742fe68a6f7864e83f5cc3"),
Comments: [
{
_id: Automatic from Mongo
text: string
author: ObjectId of the user "_id" : ObjectId("5f742fe6ca6f7f64e83f5573"),
]
