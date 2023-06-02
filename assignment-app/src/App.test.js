import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('fetches questions and populates the form', async () => {
  render(<App />);
  const nameInput = await screen.findByLabelText('Name');
  const emailInput = await screen.findByLabelText('Email');

  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});

test('updates form data on input change', async () => {
  render(<App />);
  const nameInput = await screen.findByLabelText('Name');
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });

  const emailInput = await screen.findByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

  expect(nameInput.value).toBe('John Doe');
  expect(emailInput.value).toBe('john@example.com');
});

test('validates required fields on form submission', async () => {
  render(<App />);
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  const nameError = await screen.findByRole('alert', { name: /name-error/i });
  const emailError = await screen.findByRole('alert', { name: /email-error/i });

  expect(nameError).toHaveTextContent('This field is required');
  expect(emailError).toHaveTextContent('This field is required');
});

test('validates pattern on form submission', async () => {
  render(<App />);
  const nameInput = await screen.findByLabelText('Name');
  fireEvent.change(nameInput, { target: { value: '123' } });

  const emailInput = await screen.findByLabelText('Email');
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  const nameError = await screen.findByRole('alert', { name: /name-error/i });

  expect(nameError).toHaveTextContent('Invalid format');
});