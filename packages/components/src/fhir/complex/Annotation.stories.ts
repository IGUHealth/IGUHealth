import type { Meta, StoryObj } from "@storybook/react";

import { FHIRAnnotationEditable } from "./Annotation";

const meta = {
  title: "Complex/FHIRAnnotationEditable",
  component: FHIRAnnotationEditable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRAnnotationEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: { text: "# Testing" },
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: { text: "# Testing" },
    issue: "Issue",
    onChange: (value) => console.log(value),
  },
};
