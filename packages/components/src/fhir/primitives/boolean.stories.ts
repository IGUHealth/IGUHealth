import type { Meta, StoryObj } from "@storybook/react";

import { Boolean } from "./boolean";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/boolean",
  component: Boolean,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Boolean>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExistingData: Story = {
  args: {
    value: true,
    onChange: (value: boolean) => console.log(value),
  },
};

export const Error: Story = {
  args: {
    issue: "Bad value",
    onChange: (value: boolean) => console.log(value),
  },
};
