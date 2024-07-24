import type { Meta, StoryObj } from "@storybook/react";

import { ScopeVerifyForm } from "./ScopeVerify";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "IGUHealth/ScopeVerify",
  component: ScopeVerifyForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ScopeVerifyForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "IGUHealth",
    actionURL: "#",
    scopes: ["openid", "profile", "email"],
  },
};
