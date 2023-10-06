import type { Meta, StoryObj } from "@storybook/react";

import { ContactPointEditable } from "./ContactPoint";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/ContactPoint",
  component: ContactPointEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ContactPointEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: {
      use: "home",
      system: "phone",
      value: "555-555-5555",
    },
    label: "ContactPoint",
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
