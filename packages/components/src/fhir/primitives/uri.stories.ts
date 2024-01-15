import type { Meta, StoryObj } from "@storybook/react";

import { uri } from "@iguhealth/fhir-types/r4/types";

import { FHIRUriEditable } from "./uri";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/FHIRUriEditable",
  component: FHIRUriEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRUriEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "test" as uri,
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "test" as uri,
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
