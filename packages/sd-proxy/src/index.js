"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxy = void 0;
function findNextElementIndex(sd, startIndex, field) {
    var _a, _b, _c;
    if (startIndex) {
        var curElement = (_a = sd.snapshot) === null || _a === void 0 ? void 0 : _a.element[startIndex];
        var nextElementPath = "".concat(curElement === null || curElement === void 0 ? void 0 : curElement.path, ".").concat(field.toString());
        var i = startIndex;
        while (i < (((_b = sd.snapshot) === null || _b === void 0 ? void 0 : _b.element.length) || 0)) {
            if (((_c = sd.snapshot) === null || _c === void 0 ? void 0 : _c.element[i].path) === nextElementPath) {
                return i;
            }
            i++;
        }
    }
    return undefined;
}
function createProxy(sd, value, elementIndex
// getSD: (v: string) => StructureDefinition
) {
    if (value.resourceType && sd.type !== value.resourceType)
        throw new Error("Expected '".concat(sd.type, "' but found value of '").concat(value.resourceType, "'"));
    var proxy = new Proxy(value, {
        get: function (target, field, receiver) {
            var _a;
            var curElement = elementIndex
                ? (_a = sd.snapshot) === null || _a === void 0 ? void 0 : _a.element[elementIndex]
                : undefined;
            var nextElementIndex = findNextElementIndex(sd, elementIndex, field.toString());
            var nextTarget = target[field];
            if (field === Symbol("valueOf")) {
                return nextTarget;
            }
            if (field === "__meta__") {
                return curElement;
            }
            return createProxy(sd, nextTarget, nextElementIndex);
        },
    });
    return proxy;
}
exports.createProxy = createProxy;
