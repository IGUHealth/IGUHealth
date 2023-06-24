import type { Meta, StoryObj, DecoratorFunction } from '@storybook/react';

import { Integer } from './Integer';
import { useState } from 'react';

const meta = {
  title: 'Integer',
  component: Integer,
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof String>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeStory = (initialValue: number) => {
  const story: Story = {
    args: {
      value: initialValue,
    },
    argTypes: { onChange: { action: 'changed' } }
  };
  return story
}

export const PositiveRegularPositive: Story = makeStory(1337);

export const PositiveRegularNegative: Story = makeStory(-1337)

export const PositiveRegularNegativeZero: Story = makeStory(-0)

export const PositiveRegularZero: Story = makeStory(0)

export const NegativeNan: Story = makeStory(NaN);
