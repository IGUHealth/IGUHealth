"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Small = exports.Large = exports.Secondary = exports.Primary = void 0;
var Button_1 = require("./Button");
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
var meta = {
    title: 'Example/Button',
    component: Button_1.Button,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};
exports.default = meta;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
exports.Primary = {
    args: {
        primary: true,
        label: 'Button',
    },
};
exports.Secondary = {
    args: {
        label: 'Button',
    },
};
exports.Large = {
    args: {
        size: 'large',
        label: 'Button',
    },
};
exports.Small = {
    args: {
        size: 'small',
        label: 'Button',
    },
};
