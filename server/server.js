"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var morgan_1 = require("morgan");
var fs_1 = require("fs");
var uuid_1 = require("uuid");
var app = (0, express_1.default)();
var PORT = 4000;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/todos/:id", function (req, res, next) {
    var validUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!validUuid.test(req.params.id)) {
        return res.status(500).json({
            error: {
                message: "id is not a valid UUID",
            },
        });
    }
    next();
});
app.get("/", function (req, res) {
    res.json({ message: "Todo server is working" });
});
app.get("/todos", function (req, res) {
    var todos = JSON.parse(fs_1.default.readFileSync("todos.json", "utf8"));
    res.json({ message: "Got all the todos", todos: todos });
});
app.post("/todos", function (req, res) {
    try {
        var todos = JSON.parse(fs_1.default.readFileSync("todos.json", "utf8"));
        var todo = {
            text: req.body.text,
            isDone: false,
            uuid: (0, uuid_1.v4)(),
        };
        todos.push(todo);
        fs_1.default.writeFileSync("todos.json", JSON.stringify(todos));
        res.json({ message: "Added todo", todo: todo });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else {
            console.error("An unknown error occurred");
        }
    }
});
app.delete("/todos/:id", function (req, res) {
    try {
        var todos = JSON.parse(fs_1.default.readFileSync("todos.json", "utf8"));
        var updatedTodosArray = todos.filter(function (todo) { return todo.uuid !== req.params.id; });
        if (updatedTodosArray.length === todos.length) {
            throw new Error("id is not in the todos array");
        }
        fs_1.default.writeFileSync("todos.json", JSON.stringify(updatedTodosArray));
        res.json({ message: "Deleted todo" });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else {
            console.error("An unknown error occurred");
        }
    }
});
app.patch("/todos/:id", function (req, res) {
    var id = req.params.id;
    var body = req.body;
    try {
        if (!body.text && body.isDone === undefined) {
            throw new Error("body requires properties of either \"text\" or \"isDone\"");
        }
        var todos = JSON.parse(fs_1.default.readFileSync("todos.json", "utf8"));
        var isIdCorrect_1 = false;
        var updatedTodos = todos.map(function (todo) {
            if (todo.uuid === id) {
                isIdCorrect_1 = true;
                return __assign(__assign({}, todo), body);
            }
            else {
                return todo;
            }
        });
        if (!isIdCorrect_1) {
            throw new Error("id: \"".concat(id, "\" is incorrect"));
        }
        fs_1.default.writeFileSync("todos.json", JSON.stringify(updatedTodos));
        console.log(updatedTodos);
        res.json({ message: "Updated todos", todos: updatedTodos });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else {
            console.error("An unknown error occurred");
        }
    }
});
app.patch("/todos", function (req, res) {
    try {
        var todos = [];
        fs_1.default.writeFileSync("todos.json", JSON.stringify(todos));
        res.json({ message: "Cleared todo list" });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else {
            console.error("An unknown error occurred");
        }
    }
});
app.listen(PORT, function () {
    console.log("Server listening at http://localhost:".concat(PORT));
});
