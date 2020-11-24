const uri = process.env.MONGO_URI;
const MongoClient = require("mongodb").MongoClient;
const DB_NAME = "BUGTRACKER";
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = () => {
  ///////////////////////////////////////////////////////////////////////////////////
  /////         AGGREGATE:  collection.aggregate()                  ////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const aggregate = (collectionName, pipeline = []) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== aggregate::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        collection.aggregate(pipeline).toArray((err, docs) => {
          if (err) {
            console.log(err);
            return reject("=== aggregate::collection.aggregate");
          }
          resolve(docs);
          client.close();
        });
      });
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////
  /////         COUNT:  collection.countDocuments()                 ////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const count = (collectionName) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== count::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.countDocuments({}, (err, docs) => {
          if (err) {
            console.log(err);
            return reject("=== count::collection.countDocuments");
          }
          resolve(docs);
          client.close();
        });
      });
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////         GET:   collection.find()                            ////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const get = (collectionName, query = {}) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== get::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.find(query).toArray((err, docs) => {
          if (err) {
            console.log(err);
            return reject("=== get::collection.find");
          }
          resolve(docs);
          client.close();
        });
      });
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////         ADD:    collection.insertOne()                      ////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const add = (collectionName, item) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== add::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.insertOne(item, (err, result) => {
          if (err) {
            console.log(err);
            return reject("=== add::collection.insertOne");
          }
          resolve(result);
          client.close();
        });
      });
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////
  /////         UPDATE:    collection.updateOne()                   ////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const update = (collectionName, query = {}, newValues) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== update::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.updateOne(query, newValues, (err, docs) => {
          if (err) {
            console.log(err);
            return reject("=== update::collection.updateOne");
          }
          resolve(docs);
          client.close();
        });
      });
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////
  /////         REPLACE:    collection.replaceOne()                 ////////////////
  /////////////////////////////////////////////////////////////////////////////////

  const replace = (collectionName, query = {}, newDoc) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== replace::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.replaceOne(query, newDoc, { upsert: true }, (err, docs) => {
          //upsert:true allows to add document if any was found to be replaced
          if (err) {
            console.log(err);
            return reject("=== replace::collection.replaceOne");
          }
          resolve(docs.ops);
          client.close();
        });
      });
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////
  /////         DELETE:    collection.deleteOne()                 ////////////////
  /////////////////////////////////////////////////////////////////////////////////

  const deleteOne = (collectionName, query = {}) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
        if (err) {
          console.log(err);
          return reject("=== deleteOne::MongoClient.connect");
        }
        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);
        collection.deleteOne(query, (err, docs) => {
          if (err) {
            console.log(err);
            return reject("=== deleteOne::collection.deleteeOne");
          }
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
    replace,
    deleteOne,
  };
};
