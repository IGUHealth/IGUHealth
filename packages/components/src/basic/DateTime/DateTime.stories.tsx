import type { Meta, StoryObj } from '@storybook/react';

import { Datetime } from './Time';

const meta = {
  title: 'Time',
  component: Datetime,
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof String>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: '03:54:45.323'
  },
};
