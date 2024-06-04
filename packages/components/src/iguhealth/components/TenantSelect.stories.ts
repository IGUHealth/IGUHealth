import type { Meta, StoryObj } from "@storybook/react";

import { TenantId } from "@iguhealth/jwt";

import { TenantSelect } from "./TenantSelect";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "IGUHealth/TenantSelect",
  component: TenantSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof TenantSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "IGUHealth",
    tenants: [{ id: "my-tenant" as TenantId, userRole: "member" }],
  },
};
