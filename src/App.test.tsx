import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  fetchContent: vi.fn().mockResolvedValue({
    breakfast: [
      { name: 'Test place', specialty: 'Test dish', notes: 'Test note' },
    ],
  }),
}));

test('renders the disclaimer', async () => {
  render(<App />);
  expect(await screen.findByText(/Use the/i)).toBeInTheDocument();
});

test('renders records fetched for a section', async () => {
  render(<App />);
  expect(await screen.findAllByText('Test place')).not.toHaveLength(0);
});
