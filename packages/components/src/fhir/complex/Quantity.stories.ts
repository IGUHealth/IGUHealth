import type { Meta, StoryObj } from "@storybook/react";

import { FHIRQuantityEditable } from "./Quantity";
import { createStorybookClient } from "../stories.client";
import { Quantity } from "@iguhealth/fhir-types/r4/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/FHIRQuantityEditable",
  component: FHIRQuantityEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRQuantityEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    client: createStorybookClient(),
    value: {
      comparator: ">",
      unit: "km",
      value: 55.2,
    } as Quantity,
    label: "Quantity",
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    // @ts-ignore
    value: "test",
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
