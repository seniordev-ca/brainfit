import { render, screen } from '@testing-library/react';
import { BarChartItem } from './BarChartItem';

test('renders horizontal BarChartItem', () => {
  render(<BarChartItem horizontal={true} percentComplete={50} label='Label' showPercentageLabel={true} />);
  const label = screen.getByText('Label')
  expect(label).toBeVisible()
});

test('renders vertical BarChartItem', () => {
  render(<BarChartItem horizontal={false} percentComplete={50} label='Label' showPercentageLabel={false} />);
  const label = screen.getByText('Label')
  expect(label).toBeVisible()
});
