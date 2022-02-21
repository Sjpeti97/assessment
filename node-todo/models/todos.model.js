// functions load, add find, update

const fs = require('fs/promises');
const {v4: uuidv4} = require("uuid");

let filePath = '';

const setFilePath = (path) => {
    filePath = path;
}

const checkFilePath = () => {
    if (!filePath) {
        throw 'Filepath is missing'
    }
}

const saveTodos = (todos) => {
    const raw = JSON.stringify(todos, null, 2);
    return fs.writeFile(filePath, raw);
}

const loadTodos = async () => {
    checkFilePath();
    const todos = await fs.readFile(filePath, {encoding: "utf-8"});
    return JSON.parse(todos);
}

const findTodo = async (id) => {

}

const deleteTodo = (id) => {
    //filter
    //save to json
}

const createTodo = async (text, priority, done) => {
    const todo = assembleTodo(text, priority, done);
    let allTodos = await loadTodos();
    allTodos.push(todo);
    await saveTodos(allTodos);
}

const updateTodo = async (id, todo) => {
    //map + ellenőrzés a colback elején
    //object spreading
    //save to json
}

module.exports = {
    setFilePath,
    loadTodos,
    findTodo,
    deleteTodo,
    createTodo,
    updateTodo
}

const assembleTodo = (text, priority, done) => {
    let todo = {};
    const defaultPriority = 3;

    todo.id = uuidv4();
    todo.text = text;

    if (priority<=5 && priority>=1) {
        todo.priority = priority;
    } else {
        todo.priority = defaultPriority;
    }

    if (done) {
        todo.done = done;
    } else {
        todo.done = false;
    }
    return todo;
}