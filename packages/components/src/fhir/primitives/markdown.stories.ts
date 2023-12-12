import type { Meta, StoryObj } from "@storybook/react";

import { FHIRMarkdownEditable } from "./markdown";

const meta = {
  title: "Primitives/markdown",
  component: FHIRMarkdownEditable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRMarkdownEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "urn:oid:1.2.3.4.5",
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "urn:oid:1.2.3.4.5",
    issue: "Issue",
    onChange: (value) => console.log(value),
  },
};
