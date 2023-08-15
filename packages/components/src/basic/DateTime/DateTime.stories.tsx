import type { Meta, StoryObj } from "@storybook/react";

import { DateTime } from "./DateTime";

const meta = {
  title: "Datetime",
  component: DateTime,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof String>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeStory = (initialValue: string) => {
  const story: Story = {
    args: {
      value: initialValue,
    },
    argTypes: { onChange: { action: "changed" } },
  };
  return story;
};

export const PositiveYearOnly: Story = makeStory("2022"); // Year only

export const PositiveYearAndMonth: Story = makeStory("2022-06"); // Year and month

export const PositiveCompleteDate: Story = makeStory("2022-06-23"); // Complete date

export const PositiveCompleteDateTime: Story = makeStory("2022-06-23T03:22:12"); // Complete date and time without milliseconds

export const PositiveCompleteDateTimeWithOffset: Story = makeStory(
  "2022-06-23T03:22:12+02:00"
); // Complete date and time with timezone offset

// TODO looks like antd doesn't handle leap seconds
export const PositiveCompleteDateTimeUTC: Story = makeStory(
  // Complete date and time in UTC with milliseconds
  "2018-01-01T00:00:00.000Z"
);

export const PositiveCompleteDateTimeLeapSeconds: Story = makeStory(
  "2016-12-31T23:59:60-08:00"
); // Complete date and time with timezone offset and leap seconds

export const NegativeInvalidYear: Story = makeStory("22"); // Invalid year format

export const NegativeInvalidMonth: Story = makeStory("2022-6"); // Invalid month format

export const NegativeInvalidDay: Story = makeStory("2022-06-32"); // Invalid day

export const NegativeInvalidTime: Story = makeStory(
  "2022-06-23T24:00:00+02:00"
); // Invalid time

export const NegativeInvalidMilliseconds: Story = makeStory(
  "2022-06-23T03:22:12.1234567890"
); // Invalid format for milliseconds

export const NegativeInvalidTimezoneOffset: Story = makeStory(
  "2022-06-23T03:22:12+24:00"
); // Invalid timezone offset

export const NegativeInvalidFormat: Story = makeStory(
  "2022-06-23zT03:22:12+02:00"
); // Invalid format
