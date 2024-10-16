import type { Meta, StoryObj } from "@storybook/react";

import { FHIRAddressReadOnly } from "./AddressReadOnly";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/FHIRAddressReadOnly",
  component: FHIRAddressReadOnly,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRAddressReadOnly>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: {
      line: ["1234", "West"],
      city: "San Francisco",
      state: "CA",
      postalCode: "12345",
    },
  },
};

export const BadValue: Story = {
  args: {
    // @ts-ignore
    value: "test",
  },
};
