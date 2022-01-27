/**
 * Education Test Suites
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Education } from '../Education.js';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key) => (key === 'resume.educations.date_format' ? 'MMMM YYYY' : key),
  }),
}));

describe('Educations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should Education render without crash', () => {
    const { asFragment } = render(
      <Education city="paris" degree="foo" school="bar" date="2020-10-01" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
