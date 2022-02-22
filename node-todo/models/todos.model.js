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
    checkFilePath();
    const allTodos = await loadTodos();
    return allTodos.find((item) => item.id === id);
}

const deleteTodo = async (id) => {
    const allTodos = await loadTodos();
    const updatedTodos = allTodos.filter((item) => item.id !== id);
    await saveTodos(updatedTodos);
}

const createTodo = async (text, priority, done) => {
    const todo = assembleTodo(text, priority, done);
    let allTodos = await loadTodos();
    allTodos.push(todo);
    await saveTodos(allTodos);
}

const updateTodo = async (id, todo) => {
    let updatedTodo = {};
    if (!isUpdateValid(todo)) {
        throw "this value is incorrect or not allowed to be set"
    }
    const allTodos = await loadTodos();
    const nextItem = allTodos.map((item) => {
        if (item.id !== id) {
            return item;
        } else {
            updatedTodo = {...item, ...todo}
            return updatedTodo; //object spreading
        }
    })
    await saveTodos(nextItem);
    deleteDoneAfter5min(updatedTodo);
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

const isUpdateValid = (todo) => {
    let isValid = true;
    if (todo.id) isValid = false;
    if (typeof todo.text !== "string") isValid = false;
    if (todo.priority < 1 || todo.priority > 5) isValid = false;
    if (typeof todo.done !== "boolean") isValid = false;
    return isValid;
}

const deleteDoneAfter5min = (todo) => {
    console.log("inside delete call");
    console.log(todo)
    if (todo.done === true) {
        console.log("done is true");
        setTimeout(() => {
            console.log("inside set timeout");
            if (findTodo(todo.id).done === true) deleteTodo(todo.id);
            console.log("deleted")
        }, 1000);
        console.log("after timeout call");
    }
}

