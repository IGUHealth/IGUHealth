"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
function isArray(v) {
    return Array.isArray(v);
}
function toCollection(v) {
    if (isArray(v)) {
        return v;
    }
    else {
        return [v];
    }
}
function getVariableValue(name, options) {
    var value;
    if (options.variables instanceof Function) {
        value = options.variables(name);
    }
    value = options.variables[name];
    return toCollection(value);
}
function evaluateTerm(ast, context, options) {
    var curNode = ast;
    while (curNode) {
        switch (curNode.value.type) {
            case "Literal": {
                return [curNode.value.value];
            }
            case "Variable": {
                return [getVariableValue(curNode.value.value, options)];
            }
            case "Function":
                throw new Error("Not implemented");
            case "DotAccess":
                throw new Error("Not implemented");
            case "Indexed":
                throw new Error("Not implemented");
            default:
                throw new Error("Unknown term type: '" + curNode.value.type + "'");
        }
    }
}
function evaluateOperation(ast, context, options) {
    switch (ast.operator) {
    }
}
function _evaluate(ast, context, options) {
    if (ast.type !== "Expression")
        throw new Error("Invalid AST");
    switch (ast.value.type) {
        case "Operation": {
            return evaluateOperation(ast.value, context, options);
        }
        case "Term": {
            return evaluateTerm(ast.value, context, options);
        }
    }
}
function evaluate(expression, value, options) {
    var ast = (0, parser_1.parse)(expression);
    var ctx = toCollection(value);
    _evaluate(ast, ctx, options);
    return ctx;
}
