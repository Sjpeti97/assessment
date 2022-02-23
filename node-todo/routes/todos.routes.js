const Joi = require('joi');
const {Router} = require('express');

const {
    loadTodos,
    createTodo,
    findTodo,
    updateTodo,
    deleteTodo
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
        const todoSchema = Joi.object().keys({
            text: Joi.string().required(),
            priority: Joi.number().min(1).max(5),
            done: Joi.bool()
        });
        const {error, value} = todoSchema.validate(req.body);
        if (error) {
            res.status(400).send(error).end();
        } else {
            await createTodo(req.body.text, req.body.priority, req.body.done);
            res.status(200).end();
        }
    } catch (err) {
        res.json({message: err});
    }
})

todosApi.put('/:id', async (req, res) => {
    try {
        await updateTodo(req.params.id, req.body);
        res.status(200).end();
    } catch (err) {
        res.json({message: err});
    }
})

todosApi.delete('/:id', (req, res) => {
    deleteTodo(req.params.id);
    res.status(200).end();
})

module.exports = todosApi;
