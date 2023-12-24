import type { Meta, StoryObj } from "@storybook/react";

import { FHIRCodingEditable } from "./Coding";
import { createStorybookClient } from "../stories.client";
import { Coding } from "@iguhealth/fhir-types/r4/types";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/FHIRCodingEditable",
  component: FHIRCodingEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRCodingEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    client: createStorybookClient(),
    value: {
      code: "male",
      system: "http://hl7.org/fhir/ValueSet/gender-identity",
    } as Coding,
    label: "Coding",
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
