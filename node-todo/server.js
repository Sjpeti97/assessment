const path = require("path");
const app = require("./app");
const { setFilePath } = require("./models/todos.model");

setFilePath(path.join(__dirname, "todos.json"));

const port = 3000;

app.listen(port);
