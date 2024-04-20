import type { Meta, StoryObj } from "@storybook/react";

import { Identifier } from "@iguhealth/fhir-types/r4/types";

import { createStorybookClient } from "../stories.client";
import { FHIRIdentifierEditable } from "./Identifier";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/FHIRIdentifierEditable",
  component: FHIRIdentifierEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FHIRIdentifierEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    fhirVersion: "4.0",
    client: createStorybookClient(),
    value: {
      use: "usual",
      system: "http://hl7.org/fhir/sid/us-ssn",
      value: "444222222",
    } as Identifier,
    label: "Identifier",
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    fhirVersion: "4.0",
    // @ts-ignore
    value: "test",
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
