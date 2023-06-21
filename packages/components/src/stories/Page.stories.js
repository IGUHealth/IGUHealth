"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedIn = exports.LoggedOut = void 0;
const testing_library_1 = require("@storybook/testing-library");
const Page_1 = require("./Page");
const meta = {
    title: 'Example/Page',
    component: Page_1.Page,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
};
exports.default = meta;
exports.LoggedOut = {};
// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
exports.LoggedIn = {
    play: async ({ canvasElement }) => {
        const canvas = (0, testing_library_1.within)(canvasElement);
        const loginButton = await canvas.getByRole('button', {
            name: /Log in/i,
        });
        await testing_library_1.userEvent.click(loginButton);
    },
};
//# sourceMappingURL=Page.stories.js.map