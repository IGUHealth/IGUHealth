import type { Meta, StoryObj } from "@storybook/react";

import { Id } from "./id";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/id",
  component: Id,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Id>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "test",
    onChange: (value: string) => console.log(value),
  },
};

export const InvalidId: Story = {
  args: {
    value: "*asdf",
    onChange: (value: string) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "test",
    issue: "Bad value",
    onChange: (value: string) => console.log(value),
  },
};
