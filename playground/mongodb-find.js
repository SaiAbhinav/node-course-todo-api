// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const dbName = 'TodoApp';
const colName = 'Todos';
const url = `mongodb://localhost:27017/${dbName}`;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);

    // db.collection(colName).find({
    //     _id: new ObjectID('5bf504bcce8e9126089f3f09')
    // }).toArray().then((docs) => {
    //     console.log(colName);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch docs', err);
    // });

    // db.collection(colName).find().count().then((count) => {
    //     console.log(`Todos Count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch docs', err);
    // });

    db.collection('Users').find({name: 'Abhinav'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch docs', err);
    });

    client.close();
});