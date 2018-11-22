const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

Todo.deleteMany({}).then((result) => {
    console.log(result);
});

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndDelete('5bf6517e23d11f3918c0e0a6').then((doc) => {
    console.log(doc);
});