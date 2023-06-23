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

export const PositiveYearOnly: Story = {
  args: {
    value: '2022', // Year only
  },
};

export const PositiveYearAndMonth: Story = {
  args: {
    value: '2022-06', // Year and month
  },
};

export const PositiveCompleteDate: Story = {
  args: {
    value: '2022-06-23', // Complete date
  },
};

export const PositiveCompleteDateTime: Story = {
  args: {
    value: '2022-06-23T03:22:12', // Complete date and time without milliseconds
  },
};

export const PositiveCompleteDateTimeWithOffset: Story = {
  args: {
    value: '2022-06-23T03:22:12+02:00', // Complete date and time with timezone offset
  },
};

export const PositiveCompleteDateTimeUTC: Story = {
  args: {
    // TODO looks like antd doesn't handle leap seconds
    value: '2018-01-01T00:00:00.000Z', // Complete date and time in UTC with milliseconds
  },
};

export const PositiveCompleteDateTimeLeapSeconds: Story = {
  args: {
    value: '2016-12-31T23:59:60-08:00', // Complete date and time with timezone offset and leap seconds
  },
};

export const NegativeInvalidYear: Story = {
  args: {
    value: '22', // Invalid year format
  },
};

export const NegativeInvalidMonth: Story = {
  args: {
    value: '2022-6', // Invalid month format
  },
};

export const NegativeInvalidDay: Story = {
  args: {
    value: '2022-06-32', // Invalid day
  },
};

export const NegativeInvalidTime: Story = {
  args: {
    value: '2022-06-23T24:00:00+02:00', // Invalid time
  },
};

export const NegativeInvalidMilliseconds: Story = {
  args: {
    // TODO for some reason this doesn't error
    value: '2022-06-23T03:22:12.1234567890', // Invalid format for milliseconds
  },
};

export const NegativeInvalidTimezoneOffset: Story = {
  args: {
    value: '2022-06-23T03:22:12+24:00', // Invalid timezone offset
  },
};

export const NegativeInvalidFormat: Story = {
  args: {
    value: '2022-06-23zT03:22:12+02:00', // Invalid format
  },
};

