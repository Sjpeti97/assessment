const Joi = require("joi");
const { Router } = require("express");

const {
    loadTodos,
    createTodo,
    findTodo,
    updateTodo,
    deleteTodo,
} = require("../models/todos.model");

const createTodoSchema = Joi.object().keys({
    text: Joi.string().required(),
    priority: Joi.number().min(1).max(5).default(3),
    done: Joi.bool().default(false),
});

const updateTodoSchema = Joi.object().keys({
    text: Joi.string(),
    priority: Joi.number().min(1).max(5),
    done: Joi.bool(),
});

const todosApi = Router();

todosApi.use("/:id", async (req, res, next) => {
    const todo = await findTodo(req.params.id);
    if (todo) {
        req.todo = todo;
        return next();
    }
    res.status(404).end();
});

todosApi.get("/", async (req, res) => {
    const todos = await loadTodos();
    res.json(todos);
});

todosApi.get("/:id", (req, res) => {
    res.json(req.todo);
});

todosApi.post("/", async (req, res, next) => {
    try {
        const { error, value } = createTodoSchema.validate(req.body);
        if (error) {
            res.status(400).json(error);
        } else {
            const newTodo = await createTodo(
                value.text,
                value.priority,
                value.done
            );
            res.json(newTodo);
        }
    } catch (err) {
        next(err);
    }
});

todosApi.put("/:id", async (req, res, next) => {
    try {
        const { error, value } = updateTodoSchema.validate(req.body);
        if (error) {
            return res.status(400).json(error);
        }
        const updatedTodo = await updateTodo(req.params.id, value);
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
});

todosApi.delete("/:id", async (req, res, next) => {
    try {
        await deleteTodo(req.params.id);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = todosApi;
