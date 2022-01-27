/**
 * Bars Test Suites
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Bars } from '../Bars.js';

describe('Bars', () => {
  it('should Bars render 2 items without crash', () => {
    const items = [{ name: 'foo', level: 50 },{ name: 'bar', level: 25 }];
    const { asFragment } = render(<Bars items={items} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
