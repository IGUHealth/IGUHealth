import type { Meta, StoryObj } from "@storybook/react";

import { FHIRDateEditable } from "./date";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/date",
  component: FHIRDateEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRDateEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "1980-01-01",
    onChange: (value: string) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "invalid-date",
    issue: "Bad value",
    onChange: (value: string) => console.log(value),
  },
};
