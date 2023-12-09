import type { Meta, StoryObj } from "@storybook/react";

import { UUID } from "./uuid";

const meta = {
  title: "Primitives/uuid",
  component: UUID,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UUID>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "d38ad80a-61b9-4c9b-a8e9-8c8b22659865",
    onChange: (value: string) => console.log(value),
  },
};

export const OnError: Story = {
  args: {
    value: "d38ad80a-61b9-4c9b-a8e9-8c8b22659865",
    issue: "Issue",
    onChange: (value: string) => console.log(value),
  },
};

export const InvalidValue: Story = {
  args: {
    value: "1234-1234-1234-123",
    onChange: (value: string) => console.log(value),
  },
};
