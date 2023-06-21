import type { Meta, StoryObj } from '@storybook/react';

import { String } from './String';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/String',
  component: String,
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof String>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  } as any,
};
