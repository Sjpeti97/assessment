const {Router} = require('express');

const {
    loadTodos,
    createTodo, findTodo
} = require("../models/todos.model");

const todosApi = Router();

todosApi.use('/:id', async (req, res, next) => {
    const todo = await findTodo(req.params.id);
    if (todo) {
        req.todo = todo;
        return next();
    }
    res.status(404).end();
})

todosApi.get('/', async (req, res) => {
    const todos = await loadTodos();
    res.json(todos);
})

todosApi.get('/:id', (req, res) => {
    res.json(req.todo);
})

todosApi.post('/', async (req, res) => {
    try {
        const newTodo = await createTodo(req.body.text, req.body.priority, req.body.done);
        res.json(newTodo);
    } catch (err) {
        res.json({message: err})
    }
})

todosApi.put('/:id', (req, res) => {

})

todosApi.delete('/:id', (req, res) => {

})


module.exports = todosApi;

