import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Tabs } from "./tabs";

const meta = {
  title: "Base/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    ayout: "fullscreen",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    tabs: [
      { id: 5, title: "Tab1", content: "Tab 1 content" },
      {
        id: 6,
        title: "Tab 2",
        content: <span className="font-bold">Tab 2 content</span>,
      },
      {
        id: 7,
        title: "Tab 3",
        content: <span className="font-medium underline">Tab 3 content</span>,
      },
    ],
  },
};
