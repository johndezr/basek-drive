import '@testing-library/jest-dom/vitest';
import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

test('Page', () => {
  render(<Page />);
  const main = screen.getByRole('main');
  expect(main).toBeInTheDocument();
});
