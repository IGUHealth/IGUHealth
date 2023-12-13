import type { Meta, StoryObj } from "@storybook/react";

import { FHIRCodeEditable } from "./code";
import { createStorybookClient } from "../stories.client";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/FHIRCodeEditable",
  component: FHIRCodeEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRCodeEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    client: createStorybookClient(),
    value: "test",
    onChange: (value: string | undefined) => console.log(value),
    system: "http://hl7.org/fhir/ValueSet/gender-identity",
  },
};

export const OnError: Story = {
  args: {
    client: createStorybookClient(),
    value: "test",
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
