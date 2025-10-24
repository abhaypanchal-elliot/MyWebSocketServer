const MONGO = require('mongodb').MongoClient;
const MONGO_CONFIG = require('./mongo-config');
// const {DATABASE} = require('./config');
const MONGO_URL = 'mongodb://127.0.0.1:27017/' ;
const DATABASE_NAME = 'prod_ems_db';
let MONGO_CLIENT;

function getMongoClient(p_database) {
    if (!MONGO_CLIENT) {
        return new Promise((resolve, reject) => {
            MONGO.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true}, async function (err, client) {
                if (err) {
                    return reject(err);
                }
                MONGO_CLIENT = client.db(p_database);
                resolve(MONGO_CLIENT);
            });
        });
    } else {
        return (MONGO_CLIENT);
    }
};

module.exports.dbClient = async () => {
    let database = await getMongoClient(DATABASE_NAME);
    return (database);
}