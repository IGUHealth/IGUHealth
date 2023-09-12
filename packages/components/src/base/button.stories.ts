import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta = {
  title: "Base/Button",
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: "primary",
    children: "Button",
    size: "large",
  },
};

export const Secondary: Story = {
  args: {
    type: "secondary",
    children: "Button",
    size: "large",
  },
};

export const Danger: Story = {
  args: {
    type: "danger",
    children: "Button",
    size: "small",
  },
};
