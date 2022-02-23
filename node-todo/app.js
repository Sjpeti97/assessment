const express = require('express');
const todosApi = require('./routes/todos.routes')

const app = express();

app.use(express.json());//req.body contains the http body
app.use('/todos',todosApi);

module.exports = app;