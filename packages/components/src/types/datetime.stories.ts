import type { Meta, StoryObj } from "@storybook/react";

import { DateTime } from "./datetime";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/datetime",
  component: DateTime,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
  },
} satisfies Meta<typeof DateTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "2017-01-01",
    onChange: (value: string) => console.log(value),
  },
};

export const Error: Story = {
  args: {
    value: "invalid-date",
    issue: "Bad value",
    onChange: (value: string) => console.log(value),
  },
};
