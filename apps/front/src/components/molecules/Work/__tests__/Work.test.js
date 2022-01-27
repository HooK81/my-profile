/**
 * Work Test Suites
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Work } from '../Work.js';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key, conf) => {
      if (key == 'resume.works.moment_format') {
        return 'MMMM YYYY';
      } else if (key == 'resume.works.today') {
        return 'today';
      } else if (
        [
          'resume.works.date',
          'resume.works.duration',
          'resume.works.duration_months',
          'resume.works.duration_years',
        ].includes(key)
      ) {
        let str = '';
        for (const property in conf) {
          str = str + (str !== '' ? '/' : '') + `${conf[property]}`;
        }
        return str;
      }
      return key;
    },
  }),
}));

describe('Work', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should Work without end date render without crash', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date("2020-05-13T12:33:37.000Z"));
    const { asFragment } = render(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '' }}
        description="foo **bar**"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Work exactly 1 year render without crash', () => {
    const { asFragment } = render(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2019-12-31' }}
        description="foo **bar**"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Work exactly 2 years render without crash', () => {
    const { asFragment } = render(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2020-12-31' }}
        description="foo **bar**"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Work longer than 1 year render without crash', () => {
    const { asFragment } = render(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2020-01-31' }}
        description="foo **bar**"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Work less than 1 year render without crash', () => {
    const { asFragment } = render(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-03-01', end: '2019-05-01' }}
        description="foo **bar**"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
