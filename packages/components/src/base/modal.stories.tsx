import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Modal } from "./modal";

const meta = {
  title: "Base/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropdownMenuStory: Story = {
  args: {
    children: (setIsOpen) => (
      <span
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </span>
    ),
  },
};
