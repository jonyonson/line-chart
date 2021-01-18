import React from 'react';
import { Meta, Story } from '@storybook/react';
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { AreaProps } from '../src/components/Chart';
// import AreaChart from '../src/components/AreaChart';
import { Chart } from '../src';

const meta: Meta = {
  title: 'Chart',
  component: Chart,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<AreaProps> = args => <Chart {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

const stock = appleStock.slice(800);

Default.args = {
  width: 800,
  height: 400,
  stock,
};
