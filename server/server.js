var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            status: "400",
            message: "ID not valid"
        });
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                status: "404",
                message: "Todo not found"
            });
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send({
            status: "400",
            message: e
        });
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            status: "400",
            message: "ID not valid"
        });        
    }
    Todo.findOneAndDelete(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                status: "404",
                message: "Todo not found"
            });            
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send({
            status: "400",
            message: e
        });
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};