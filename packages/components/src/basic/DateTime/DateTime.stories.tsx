import type { Meta, StoryObj } from '@storybook/react';

import { Datetime } from './DateTime';

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
    value: '2022-06-23T03:22:12+02:00'
  },
};

export const Secondary: Story = {
  args: {
    // invalid
    value: '2022-06-23zT03:22:12+02:00'
  },
};
