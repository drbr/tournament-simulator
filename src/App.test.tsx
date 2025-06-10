import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tournament simulator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Tournament Simulator - Random Numbers Display/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders generate new numbers button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Generate New Numbers/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders swap circles button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Swap Circles/i);
  expect(buttonElement).toBeInTheDocument();
});
