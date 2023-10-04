import type { Meta, StoryObj } from "@storybook/react";

import { Markdown } from "./markdown";

const meta = {
  title: "Primitives/markdown",
  component: Markdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "urn:oid:1.2.3.4.5",
    onChange: (value: string) => console.log(value),
  },
};

export const Error: Story = {
  args: {
    value: "urn:oid:1.2.3.4.5",
    issue: "Issue",
    onChange: (value: string) => console.log(value),
  },
};
