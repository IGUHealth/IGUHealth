import type { Meta, StoryObj } from "@storybook/react";

import { SignupForm } from "./Signup";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "IGUHealth/SignupForm",
  component: SignupForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof SignupForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Form: Story = {
  args: { action: "#" },
};
