import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { basicSetup } from "codemirror";

import { CodeMirror, CodeMirrorProps } from "./codemirror";

const BasicCodeMirror = ({
  value,
  autoFocus,
  theme,
  onChange,
}: Pick<CodeMirrorProps, "value" | "autoFocus" | "theme" | "onChange">) => {
  return (
    <CodeMirror
      value={value}
      autoFocus={autoFocus}
      theme={theme}
      onChange={onChange}
      extensions={[basicSetup]}
    />
  );
};

const meta = {
  title: "Base/CodeMirror",
  component: BasicCodeMirror,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BasicCodeMirror>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSetup: Story = {
  args: {
    value: "primary",
    onChange: (value: string, update) => console.log(value),
    autoFocus: true,
    theme: {
      "&": {
        height: "400px",
        width: "400px",
      },
    },
  },
};
