import { render, screen } from '@testing-library/react';
import { SplashScreen } from './SplashScreen';

test('renders SplashScreen', () => {
  render(<SplashScreen centerContent={<>test content</>}/>);
  const text = screen.getByText(/test content/i);
  expect(text).toBeInTheDocument();
});
