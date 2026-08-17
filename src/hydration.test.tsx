import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import { vi } from 'vitest';
import App from './App';
import { CONTENT_KEY } from './api';
import { render as renderToStaticMarkup } from './entry-server';

// vi.mock is hoisted above the rest of the module, so the fixture it closes
// over has to be declared through vi.hoisted rather than a plain const.
const { content } = vi.hoisted(() => ({
  content: {
    places: [
      {
        name: 'Test place',
        specialty: 'Test dish',
        notes: 'Test note',
        tags: ['colazione'],
      },
    ],
    specialties: [
      { title: 'Test specialty', img: '/img.png', link: null, dish: 'test-dish' },
    ],
  },
}));

const fallback = { [CONTENT_KEY]: content };

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  // Revalidation returns what the prerender already put in the cache.
  fetchContent: vi.fn(() => Promise.resolve(content)),
}));

test('hydrates the prerendered markup without a mismatch', async () => {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(fallback);
  document.body.appendChild(container);

  const errors: unknown[] = [];

  await act(async () => {
    hydrateRoot(
      container,
      <SWRConfig value={{ fallback }}>
        <App />
      </SWRConfig>,
      { onRecoverableError: (error) => errors.push(error) }
    );
  });

  expect(errors).toEqual([]);
  expect(container.textContent).toContain('Test place');
});
