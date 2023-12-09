import type { Meta, StoryObj } from "@storybook/react";

import { Instant } from "./instant";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/instant",
  component: Instant,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
  },
} satisfies Meta<typeof Instant>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "2015-02-07T13:28:17.239+02:00",
    onChange: (value: string) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "invalid-instant",
    issue: "Bad value",
    onChange: (value: string) => console.log(value),
  },
};
