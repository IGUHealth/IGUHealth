import type { Meta, StoryObj } from "@storybook/react";

import { HumanNameEditable } from "./HumanName";

const meta = {
  title: "Complex/HumanName",
  component: HumanNameEditable,
  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],
} satisfies Meta<typeof HumanNameEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: {
      given: ["Bob", "David"],
      family: "Smith",
    },
    label: "Name",
    onChange: (value) => console.log(value),
  },
};

export const Error: Story = {
  args: {
    // @ts-ignore
    value: "test",
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
