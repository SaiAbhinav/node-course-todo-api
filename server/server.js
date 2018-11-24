require('./config/config')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

// Create a new todo
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

// Get all the todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

// Get a specific todo
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

// Delete a specific todo
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            status: "400",
            message: "ID not valid"
        });        
    }
    Todo.findByIdAndDelete(id).then((todo) => {
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

// Update a specific todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: "ID not valid"
        });
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

// Signup for a new user
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {            
            res.set('x-auth', token).send(user);
        })
        .catch((e) => res.status(400).send(e));
});

// Get my authentication
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// Login for a existing user
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// Logout the loggedin user
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`\nStarted up at port ${port}`);
});

module.exports = {
    app
};