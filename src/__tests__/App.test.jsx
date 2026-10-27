import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { fetchAPI } from '../utils/api';
import { daysFromToday } from './helpers';

const renderAt = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe('App', () => {
  it('renders the home page with semantic landmarks', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Little Lemon' })).toBeInTheDocument();
  });

  it('navigates to the booking page from the hero button', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: /reserve a table/i }));
    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  });

  it('toggles the mobile menu and updates aria-expanded', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('completes a booking end to end and shows the confirmation', async () => {
    const user = userEvent.setup();
    renderAt('/booking');
    const date = daysFromToday(1);
    const [y, m, d] = date.split('-').map(Number);
    const time = fetchAPI(new Date(y, m - 1, d))[0];

    await user.type(screen.getByLabelText(/full name/i), 'Anna Smith');
    await user.type(screen.getByLabelText(/email/i), 'anna@example.com');
    fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: date } });
    await user.selectOptions(screen.getByLabelText(/choose time/i), time);
    await user.selectOptions(screen.getByLabelText(/occasion/i), 'Birthday');
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(screen.getByRole('heading', { name: /your table is booked/i })).toBeInTheDocument();
    expect(screen.getByText(time)).toBeInTheDocument();
    expect(screen.getByText('Birthday')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Anna Smith');
  });

  it('redirects /confirmed to the booking form when there is no booking', () => {
    renderAt('/confirmed');
    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  });

  it('shows a 404 page for unknown routes', () => {
    renderAt('/does-not-exist');
    const main = screen.getByRole('main');
    expect(within(main).getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
