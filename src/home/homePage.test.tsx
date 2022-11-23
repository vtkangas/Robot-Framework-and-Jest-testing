import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

xtest('renders home heading', () => {
  render(<HomePage />);
  expect(screen.getByRole('heading')).toHaveTextContent('Home');
});