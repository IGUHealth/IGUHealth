import type { Meta, StoryObj } from "@storybook/react";

import { OID } from "./oid";

const meta = {
  title: "Primitives/oid",
  component: OID,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OID>;

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

export const InvalidValue: Story = {
  args: {
    // @ts-ignore
    value: "bad-value",
    onChange: (value: string) => console.log(value),
  },
};
