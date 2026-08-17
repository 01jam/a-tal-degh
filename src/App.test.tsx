import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// vi.mock is hoisted above the rest of the module, so the fixture it closes
// over has to be declared through vi.hoisted rather than a plain const.
const { content } = vi.hoisted(() => ({
  content: {
    specialties: [
      { title: 'Tortellini', img: '/img.png', link: null, dish: 'tortellini' },
      { title: 'Borlenghi', img: '/img.png', link: null, dish: 'borlenghi' },
    ],
    places: [
      {
        name: 'Trattoria Aldina',
        specialty: 'Lo stinco e tortellini',
        notes: 'Test note',
        link: null,
        tags: ['pranzo', 'tortellini'],
      },
      {
        name: 'Mr. Brown',
        notes: 'Birra',
        link: null,
        tags: ['bere'],
      },
    ],
  },
}));

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  fetchContent: vi.fn().mockResolvedValue(content),
}));

test('renders the intro', async () => {
  render(<App />);
  expect(await screen.findByText(/Questa pagina nasce/i)).toBeInTheDocument();
});

test('renders places fetched for a tagged section', async () => {
  render(<App />);
  expect(await screen.findAllByText('Trattoria Aldina')).not.toHaveLength(0);
});

test('opens the dish overlay filtered to the pressed specialty, and Escape closes it', async () => {
  render(<App />);

  const tortelliniCard = await screen.findByRole('button', { name: /Tortellini/i });
  fireEvent.click(tortelliniCard);

  const dialog = await screen.findByRole('dialog');

  // Filtered correctly: the place tagged tortellini shows up in the
  // overlay (it also legitimately shows in the "Trattorie" section, since
  // it is tagged for both — this checks the overlay specifically)...
  expect(within(dialog).getByText('Trattoria Aldina')).toBeInTheDocument();
  // ...a place tagged only for a different occasion does not.
  expect(within(dialog).queryByText('Mr. Brown')).not.toBeInTheDocument();

  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('reopens filtered to a different specialty after being closed', async () => {
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: /Tortellini/i }));
  let dialog = await screen.findByRole('dialog');
  expect(within(dialog).getByText('Trattoria Aldina')).toBeInTheDocument();

  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  // The overlay's displayed content lags the close so it can animate out —
  // check it doesn't get stuck showing the previous dish once reopened.
  fireEvent.click(await screen.findByRole('button', { name: /Borlenghi/i }));
  dialog = await screen.findByRole('dialog');
  expect(
    within(dialog).getByText(/Nessun locale ancora segnalato/i)
  ).toBeInTheDocument();
  expect(within(dialog).queryByText('Trattoria Aldina')).not.toBeInTheDocument();
});

test('shows an empty state for a dish with no places yet', async () => {
  render(<App />);

  const borlenghiCard = await screen.findByRole('button', { name: /Borlenghi/i });
  fireEvent.click(borlenghiCard);

  expect(
    await screen.findByText(/Nessun locale ancora segnalato/i)
  ).toBeInTheDocument();
});
