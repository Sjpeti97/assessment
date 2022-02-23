const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const { raw } = require("express");

let filePath = "";
let deleteDelayMs = 300000;

const setDeleteDelayMs = (ms) => {
    deleteDelayMs = ms;
};

const setFilePath = (path) => {
    filePath = path;
};

const checkFilePath = () => {
    if (!filePath) {
        throw "Filepath is missing";
    }
};

const saveTodos = (todos) => {
    const raw = JSON.stringify(todos, null, 2);
    return fs.writeFile(filePath, raw);
};

const loadTodos = async () => {
    checkFilePath();

    try {
        const todos = await fs.readFile(filePath, { encoding: "utf-8" });
        return JSON.parse(todos || "[]");
    } catch {
        return [];
    }
};

const findTodo = async (id) => {
    checkFilePath();
    const allTodos = await loadTodos();
    return allTodos.find((item) => item.id === id);
};

const deleteTodo = async (id) => {
    const allTodos = await loadTodos();
    const updatedTodos = allTodos.filter((item) => item.id !== id);
    await saveTodos(updatedTodos);
};

const createTodo = async (text, priority, done) => {
    const todo = assembleTodo(text, priority, done);
    let allTodos = await loadTodos();
    allTodos.push(todo);
    await saveTodos(allTodos);
    return todo;
};

const updateTodo = async (id, todo) => {
    let updatedTodo = {};
    const allTodos = await loadTodos();
    const nextItem = allTodos.map((item) => {
        if (item.id !== id) {
            return item;
        } else {
            updatedTodo = { ...item, ...todo };
            return updatedTodo; //object spreading
        }
    });
    await saveTodos(nextItem);
    deleteDoneAfter5min(updatedTodo);
    return updatedTodo;
};

const assembleTodo = (text, priority, done) => {
    let todo = {};
    todo.id = uuidv4();
    todo.text = text;
    todo.priority = priority;
    todo.done = done;
    return todo;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const deleteDoneAfter5min = async (todo) => {
    if (todo.done === true) {
        await delay(deleteDelayMs);
        if ((await findTodo(todo.id)).done === true) {
            await deleteTodo(todo.id);
        }
    }
};

module.exports = {
    setDeleteDelayMs,
    setFilePath,
    loadTodos,
    findTodo,
    deleteTodo,
    createTodo,
    updateTodo,
};
