"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedOut = exports.LoggedIn = void 0;
var Header_1 = require("./Header");
var meta = {
    title: 'Example/Header',
    component: Header_1.Header,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
};
exports.default = meta;
exports.LoggedIn = {
    args: {
        user: {
            name: 'Jane Doe',
        },
    },
};
exports.LoggedOut = {};
