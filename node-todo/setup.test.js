const fs = require('fs/promises');
const path = require('path');
const {setFilePath, setDeleteDelayMs} = require("./models/todos.model");

const testFile = path.join(__dirname, 'todos.test.json');

beforeAll(() => {
    setFilePath(testFile);
    setDeleteDelayMs(500);
});

afterAll(() => {
    return fs.unlink(testFile);
})