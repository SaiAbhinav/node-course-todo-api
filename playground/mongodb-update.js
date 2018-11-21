const { MongoClient, ObjectID } = require('mongodb');

const dbName = 'TodoApp';
const url = `mongodb://localhost:27017/${dbName}`;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bf52f3855f93671827f5a07')
    // }, {
    //     $set: { completed: true }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').findOneAndUpdate({
    //     _id: new ObjectID('5bf5064198073e21b07ba77a')
    // }, {
    //     $set: { name: 'Abhinav' },
    //     $inc: { age: 5 }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    var colName = 'Todos';

    db.collection(colName).find({ text: "Eat lunch" }).toArray().then((docs) => {
        console.log(`Task: ${docs[0].text}.\nStatus: ${docs[0].completed}.\nChanging...`);
        var newStatus = !docs[0].completed;
        db.collection(colName).findOneAndUpdate({
            _id: new ObjectID(docs[0]._id)
        }, {
            $set: { completed: newStatus }
        }, { returnOriginal: false }).then((result) => {
            console.log(`Task: ${result.value.text}.\nStatus: ${result.value.completed}.`);
            client.close();
        });
    });    
});