"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secondary = exports.Primary = void 0;
const DateTime_1 = require("./DateTime");
const meta = {
    title: 'Time',
    component: DateTime_1.Datetime,
    tags: ['autodocs'],
    argTypes: {},
};
exports.default = meta;
exports.Primary = {
    args: {
        value: '03:54:45.323'
    },
};
exports.Secondary = {
    args: {
        value: '0:542:45.323'
    },
};
//# sourceMappingURL=DateTime.stories.js.map