import type { Meta, StoryObj } from "@storybook/react";

import { CodeableConcept } from "@iguhealth/fhir-types/r4/types";

import { createStorybookClient } from "../stories.client";
import { FhirCodeableConceptEditable } from "./CodeableConcept";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Complex/FhirCodeableConceptEditable",
  component: FhirCodeableConceptEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FhirCodeableConceptEditable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    fhirVersion: "4.0",
    client: createStorybookClient(),
    value: {
      coding: [
        { code: "test", display: "test" },
        { code: "testing2", display: "test2" },
      ],
    } as CodeableConcept,
    onChange: (value) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    fhirVersion: "4.0",
    client: createStorybookClient(),
    // @ts-ignore
    value: "test",
    issue: "Bad value",
    onChange: (value) => console.log(value),
  },
};
