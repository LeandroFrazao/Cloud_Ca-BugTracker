const uri = process.env.MONGO_URI;
console.log (uri);
const MongoClient = require('mongodb').MongoClient;
const DB_NAME = "BUGTRACKER";
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true};

module.exports = () => {   
    
    const aggregate = (collectionName, pipeline =[])=>{
        return new Promise((resolve, reject)=>{
            MongoClient.connect(uri,MONGO_OPTIONS,(err, client)=>{
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);

                collection.aggregate(pipeline).toArray((err, docs)=>{
                    if (err){
                        console.log("--- Aggregate ERROR ---");
                        console.log(err);
                    }
                    resolve(docs);
                    client.close();
                })
            })
        })
    }
    
    const count = (collectionName)=>{
        return new Promise((resolve, reject)=>{
            MongoClient.connect(uri, MONGO_OPTIONS,(err, client) =>{ 
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);  
                collection.countDocuments({}, (err, docs)=>{
                    resolve(docs);
                    client.close();
                })
            })
        })
    }
    
    const get = (collectionName, query = {})=>{
        return new Promise((resolve, reject)=>{
            MongoClient.connect(uri, MONGO_OPTIONS,(err, client) =>{
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).toArray((err, docs)=>{                    
                    resolve(docs);
                    client.close();
                })
            })
        });
    }; 
    
    
    const add= (collectionName, item)=>{
        return new Promise((resolve, reject)=>{
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client)=>{
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.insertOne(item, (err, result) =>{
                    resolve(result);
                    client.close();
                    
                }) 
            }) 
        });
    };

    const update = (collectionName, query = {}, newValues) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                //const quer = { issueNumber: "BOOK-1" };
                //const newVal = { $set: { status: "close" } };
                collection.updateOne(query, newValues, (err, docs) => {
                    resolve(docs);
                    client.close();

                });
            });
        });
    };
    
    return {
        get,
        add,
        count,
        aggregate,
        update,
       
    };
};