import type { Meta, StoryObj } from "@storybook/react";

import { Time } from "./time";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/time",
  component: Time,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Time>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "12:00:00",
    onChange: (value: string) => console.log(value),
  },
};

export const Error: Story = {
  args: {
    value: "invalid-time",
    issue: "Bad value",
    onChange: (value: string) => console.log(value),
  },
};
