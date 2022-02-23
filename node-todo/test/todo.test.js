const request = require("supertest");
const app = require('../app');
const {createTodo, findTodo} = require("../models/todos.model");

let testTodo1;
let testTodo2;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

beforeAll(async () => {
    testTodo1 = await createTodo("text", 4, false);
    testTodo2 = await createTodo("text2", 5, false);
})

describe('test get route', () => {
    test("Should respond wit 200", () => {
        return request(app)
            .get("/todos")
            .then(response => {
                expect(response.statusCode).toBe(200);
            })
    })
});

describe('test get/id route', () => {
    test("Should respond wit 200", () => {
        return request(app)
            .get(`/todos/${testTodo1.id}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
            })
    })
});

describe('test post/ route', () => {
    test("Should respond wit 200", () => {
        return request(app)
            .post("/todos").set("Content-Type", "application/json").send(JSON.stringify({
                text: "test text",
                priority: 1
            }))
            .then(response => {
                expect(response.statusCode).toBe(200);
                return findTodo(response.body.id);
            })
            .then((todo) => {
                expect(todo).toHaveProperty("text", "test text");
            })
    })
});

describe('test update/id route', () => {
    let deleteMe;
    beforeAll(async () => {
        deleteMe = await createTodo("delete");
    });
    test("Should respond wit 200", () => {
        return request(app)
            .put(`/todos/${deleteMe.id}`).set("Content-Type", "application/json").send(JSON.stringify({
                done: true
            }))
            .then(response => {
                expect(response.statusCode).toBe(200);
                return delay(1000);
            })
            .then(() => {
                return findTodo(deleteMe.id);
            })
            .then((todo) => {
                expect(todo).toBeUndefined();
            })
    })
});



