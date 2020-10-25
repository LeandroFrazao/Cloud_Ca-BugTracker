const { on } = require("nodemon");

const db = require("../db")();
const COLLECTION = "issues";

const  ObjectID = require('mongodb').ObjectID;


module.exports = () =>{
    
    const get = async(id = null) =>{  // find document or using issueNumber or issues _id 
        console.log('Inside Issues Model');
        var issues = null;
        if  (!slug){
            try {
                issues = await db.get(COLLECTION);
            } catch (error) {
                error = "There no Issues Registered";
                return error;
            }
        } else {
            try {
                const issuenum = slug.toUpperCase();
                issues = await db.get(COLLECTION, { issueNumber: issuenum});
            } catch (error) {
                error = "Issue Not Found!";
                return error;
            }
        }
        if ( issues.length ==0 ){
            try {                 // if user used _id instead of slug,
                issues = await db.get(COLLECTION, { "_id": ObjectID(id) });  //use objectid to get id from mongodb
            } catch (error) {
                error = "Issue Not Found!";
                return error; 
            }
        }
        return issues;
    } 

    const getIssuesByProject = async (slug) => {
        try {
            const project = await db.get("projects", { "slug": slug.toUpperCase() });    
            const issues = await db.get(COLLECTION, { "project_id": project[0]._id });
            return issues;
        } catch (error) {
            error = "Slug (" + slug + ") Not Found"
            return error;
        }  
    }

    const add = async (slug, title,description,status)=>{
        
        let project;
        let id_slug = null;
        project = await db.get("projects", { "slug": slug.toUpperCase() });
        if (project.length ==0) {
            error = "Slug ("+ slug+") Not Found"
            return error;
        }   
         try {    
            const PIPELINE_COUNT_PROJECTS_ISSUES = [  // count number of projects with same id
                { $match: { 'project_id': ObjectID(project[0]._id) } },
                { $count: 'project_id' }
            ];
           const count_projects = await db.aggregate(COLLECTION, PIPELINE_COUNT_PROJECTS_ISSUES); 
            id_slug = count_projects[0].project_id + 1;
        } catch (error) {
             error; 
            id_slug = 1;  // the project has an issue for the first time
        }
        try {
            const results = await db.add(COLLECTION, {
                issueNumber: slug.toUpperCase()+"-"+ id_slug, //db.projects.slug + id,
                title:title,
                description: description,
                status: status,
                project_id: project[0]._id,
                comments: []
            }); 
            return results.result;       
        } catch (error) {
            return error;
        }      
    }

    const getComment = async (issueNum = null, comment_id = null) => {
        
        var issues;
        try {
            issues = await db.get(COLLECTION, { issueNumber: issueNum.toUpperCase() })
        } catch (error) {
             error = "No Comments Found"
                /* return error;
                } */
                error = "Issue Number not Found"
                return error;            
        }
        if (issues[0]== undefined) {
            error = "Issue Number not Found"
            return error;
       }
        if (comment_id != null) {
            console.log(comment_id);
            PIPELINE_COMMENT_ID = [
            {$match: {'issueNumber': issueNum.toUpperCase()}},{ $project: {_id: 1,title: 1,issueNumber:1,description: 1,status: 1,project_id: 1,
            comments: { "$filter":{input: '$comments', as: 'comment', cond: {$eq: ['$$comment.id', parseInt(comment_id)]   }}}}} ]
            
            try {
                const comment = await db.aggregate(COLLECTION, PIPELINE_COMMENT_ID);
                console.log(comment[0].comments.length);
                if (comment[0].comments.length!=0) {
                    return comment;
                } else {
                    error= "Issue with Comment ID ("+ comment_id +") Not Found";
                    return error;
                } 

                
            } catch (error) {
                return error;
                }
        }         
            // console.log(issueNumber[0].comments.length);
                        //users = await db.get(COLLECTION, { email: issue.toLowerCase() }); //use objectid to get id from mongodb               

                //const aggreUser = userAggregate(issue);
                // console.log(aggreUser +" issue > " +issue);
                    //const issues = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
                //const aggreUser = userAggregate();
                // console.log(aggreUser);
               
        return issues[0].comments;
    }

    const addComment = async (project_slug, id_or_email, text) => {
        console.log(id_or_email, text);

        let author_id = null;
        let author = null;
        try {
            const authorid = await db.get("users", { "_id": ObjectID(id_or_email) }); //first try if the pointer id_or_email is a valid user id.
            author = authorid[0];
        } catch (error) {
            // damn NODE JS WITH STUPID BUG!!!
        }
        try {
            const authoremail = await db.get("users", { "email": id_or_email });  // if is not an id, then try with email,
            author = authoremail;
            console.log(authoremail + " email");
            author_id = author[0].email;
            } catch (error) {
                error = " User Not Found";
            return error;
            }
            var count = 0;
            const PIPELINE_COUNT_PROJECT_COMMENTS = [
                { $match: { 'issueNumber': project_slug.toUpperCase() } },
                { $project: { _id: false, item: 1, counter: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0" } } } }];
            
            try {
                const count_comments = await db.aggregate(COLLECTION, PIPELINE_COUNT_PROJECT_COMMENTS);
                console.log("count comments:" + (count_comments[0] != undefined ? "true" : "false"));
            if (count_comments[0] != undefined) { // if  was found the project, then count_comments is not undefined.
                count = count_comments[0].counter + 1;
            }
            const comments = {
                id: count,
                text: text,
                author: author_id
            };
            const results = await db.update(COLLECTION, { 'issueNumber': project_slug.toUpperCase() }, {
                $push: { 'comments': comments }
            })
            return results.result;
            } catch (error) {
                error = "Project Not Found";
                return error;
            }
            
    }

    return {
        get,
        getIssuesByProject,
        add,
        addComment,
        getComment,
        
    }
};