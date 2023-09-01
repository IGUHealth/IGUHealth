import type { Meta, StoryObj } from "@storybook/react";
import HTTPClient from "@iguhealth/client/lib/http";
import { ValueSet } from "@iguhealth/fhir-types";
import { r4 } from "@iguhealth/generated-ops";

import { Code } from "./code";

const client = HTTPClient({
  url: "http://hapi.fhir.org/baseR4",
  getAccessToken: () => Promise.resolve(""),
});

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Primitives/code",
  component: Code,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "test",
    onChange: (value: string | undefined) => console.log(value),
    expand: async (_url) => {
      return {
        resourceType: "ValueSet",
        id: "gender-identity",
        url: "http://hl7.org/fhir/ValueSet/gender-identity",
        status: "active",
        compose: {
          include: [
            {
              system: "http://hl7.org/fhir/gender-identity",
              concept: [
                {
                  code: "male",
                  display: "male",
                },
                {
                  code: "female",
                  display: "female",
                },
                {
                  code: "non-binary",
                  display: "non-binary",
                },
                {
                  code: "transgender-male",
                  display: "transgender male",
                },
                {
                  code: "transgender-female",
                  display: "transgender female",
                },
                {
                  code: "other",
                  display: "other",
                },
                {
                  code: "non-disclose",
                  display: "does not wish to disclose",
                },
              ],
            },
          ],
        },
        expansion: {
          identifier: "857f31b2-6975-42c7-bfd7-8d63588ce310",
          timestamp: "2023-09-01T17:51:50+00:00",
          total: 7,
          offset: 0,
          parameter: [
            {
              name: "offset",
              valueInteger: 0,
            },
            {
              name: "count",
              valueInteger: 1000,
            },
          ],
          contains: [
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "male",
              display: "male",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "female",
              display: "female",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "non-binary",
              display: "non-binary",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "transgender-male",
              display: "transgender male",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "transgender-female",
              display: "transgender female",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "other",
              display: "other",
            },
            {
              system: "http://hl7.org/fhir/gender-identity",
              version: "4.0.1",
              code: "non-disclose",
              display: "does not wish to disclose",
            },
          ],
        },
      };
    },
  },
};

export const Error: Story = {
  args: {
    value: "test",
    issue: "Bad value",
    onChange: (value: string | undefined) => console.log(value),
  },
};
