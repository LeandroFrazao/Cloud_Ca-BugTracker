const db = require("../db")();
const COLLECTION = "issues";

const  ObjectID = require('mongodb').ObjectID;


module.exports = () =>{
    
    const get = async(id = null) =>{  // find document or using issueNumber or issues _id 
        console.log('Inside Issues Model');
        var issues = null;
        if  (!id){
            try {
                issues = await db.get(COLLECTION);
            } catch (error) {
                error = "There no Issues Registered";
                return error;
            }
        } else {
            try {
                const issuenum = id.toUpperCase();
                issues = await db.get(COLLECTION, { issueNumber: issuenum});
            } catch (error) {
                error = "Issue Not Found!";
                return error;
            }
        }
        if ( issues.length ==0 ){
            try {
                issues = await db.get(COLLECTION, { _id: ObjectID(id) });  //use objectid to get id from mongodb
            } catch (error) {
                error = "Issue Not Found!";
                return error; 
            }
        }
        return issues;
    } 

    const add = async (title,description,status, project_id)=>{
        const PIPELINE_COUNT_PROJECTS_ISSUES = [  // count number of projects with same id
            { $match: { 'project_id': ObjectID(project_id) } },
            { $count: 'project_id' }
        ];

        var id_slug = null;
        try {
           const count_projects = await db.aggregate(COLLECTION, PIPELINE_COUNT_PROJECTS_ISSUES); 
            id_slug = count_projects[0].project_id + 1;
        } catch (error) {
             id_slug = 1;  // the project has an issue for the first time
        }
        const project = await db.get("projects", {_id:ObjectID(project_id)});
        const results = await db.add(COLLECTION, {
            issueNumber: project[0].slug+"-"+ id_slug, //db.projects.slug + id,
            title:title,
            description: description,
            status: status,
            project_id: project[0]._id,
            comments: []
            

        });
        return results.result;    
    }
    const userAggregate = async (userEmail ) => {
        const LOOKUP_USERS_PIPELINE = [
            {$match: {'comments.author': ObjectID("5f90abfb37c6eb3934e42f8d")}},
            {
             $lookup:{
                 from: "users",
                 localField: "comments.author",
                 foreignField: "_id",
                 as: "user", 
             },
         }, { $project: {
                         _id: 1,
                         title: 1,
                         description: 1,
                         status: 1,
                         project_id: 1,
                         commemts: { "$filter":{
                                    input: '$comments',
                                     as: 'comment',
                                     cond: {$eq: ['$$comment.author', ObjectID("5f90abfb37c6eb3934e42f8d")]
                             }}}}} ];
        
        users = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
        const com = users[0].comments;
        console.log( " inside pipeline",users[0], com);
        return users;
    }

    const getComment = async (issue = null) => {
        
        var issueNumber;
        try {
            issueNumber = await db.get(COLLECTION, { issueNumber: issue.toUpperCase() })
 
                        //const aggreUser = userAggregate(issue);
                        // console.log(aggreUser +" issue > " +issue);
            //const issues = await db.aggregate(COLLECTION, LOOKUP_USERS_PIPELINE);
            //console.log(issues[0]._id +"< issues  ");
                      // console.log(issueNumber);
          //  if (issueNumber[0].comments.length == 0) {
                //users = await db.get(COLLECTION, { email: issue.toLowerCase() }); //use objectid to get id from mongodb                
           

            //   return issueNumber[0].comments; 
         //  }
            
        } catch (error) {
            //const aggreUser = userAggregate();
           // console.log(aggreUser);
                error = "No Comments Found"
                /* return error;
                } */
                error = "Issue Number not Found"
                return error;
            
        }
        return issueNumber[0].comments;
    }



    const addComment = async (id_or_email , text, author) => {
        console.log(id_or_email, text);
        const author_id = null;
        try {
           try {
                authorid = await db.get("users", {_id:ObjectID(id_or_email)}); 
                author_id =  authorid[0]._id;
           } catch (error) {
                const author_email = await db.get("users", {email:id_or_email}); 
                author_id =author_email[0]._id;
            } 
        } catch (error) {
            //error = " User Not Found";
           // return error;
        }
        var count = 0;
        console.log(author);
       // if (author_id[0].length != 0) {
            const PIPELINE_COUNT_PROJECT_COMMENTS = [
                { $match: { 'author': ObjectID(author_id) } },
                { $project: { item: 1, CountComments: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "null" } } } }
            ];
            

            const count_comments = await db.aggregate(COLLECTION, PIPELINE_COUNT_PROJECT_COMMENTS);
            console.log(count_comments);
        count = 1; //count_comments[0].author + 1;
      //  }
          
            //const commentsCount = await db.count(COLLECTION);

        const results = await db.add(COLLECTION, {
            comments: [
                {
                    comment_id: count + 1,
                    text: text,
                   // author: author_id,
                }
            ]
        })
        return results.result;
    }


    return {
        get,
        add,
        addComment,
        getComment,
        
    }
};