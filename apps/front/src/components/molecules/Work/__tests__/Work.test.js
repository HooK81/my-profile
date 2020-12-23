/**
 * Work Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Work } from '../Work.js';
import ReactMarkdown from 'react-markdown';

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

  it('Should Work without end date render without crash', () => {
    const wrapper = shallow(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '' }}
        description="foo **bar**"
      />,
    );
    expect(wrapper.find('.work')).toHaveLength(1);
    expect(wrapper.find('.work p.info')).toHaveLength(1);
    expect(wrapper.find('.work h3').contains('god')).toBe(true);
    expect(wrapper.find('.work span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.work span.company').contains('world')).toBe(true);
    expect(wrapper.find('.work span.date').text()).toMatch('January 2019');
    expect(wrapper.find('.work span.date').text()).toMatch('today');
    expect(wrapper.find(ReactMarkdown)).toHaveLength(1);
    expect(wrapper.find(ReactMarkdown).prop('className')).toBe('description');
  });

  it('Should Work exactly 1 year render without crash', () => {
    const wrapper = shallow(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2019-12-31' }}
        description="foo **bar**"
      />,
    );
    expect(wrapper.find('.work')).toHaveLength(1);
    expect(wrapper.find('.work p.info')).toHaveLength(1);
    expect(wrapper.find('.work h3').contains('god')).toBe(true);
    expect(wrapper.find('.work span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.work span.company').contains('world')).toBe(true);
    expect(wrapper.find('.work span.date').contains('January 2019/December 2019/1/')).toBe(true);
    expect(wrapper.find(ReactMarkdown)).toHaveLength(1);
    expect(wrapper.find(ReactMarkdown).prop('className')).toBe('description');
  });

  it('Should Work exactly 2 years render without crash', () => {
    const wrapper = shallow(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2020-12-31' }}
        description="foo **bar**"
      />,
    );
    expect(wrapper.find('.work')).toHaveLength(1);
    expect(wrapper.find('.work p.info')).toHaveLength(1);
    expect(wrapper.find('.work h3').contains('god')).toBe(true);
    expect(wrapper.find('.work span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.work span.company').contains('world')).toBe(true);
    expect(wrapper.find('.work span.date').contains('January 2019/December 2020/2/')).toBe(true);
    expect(wrapper.find(ReactMarkdown)).toHaveLength(1);
    expect(wrapper.find(ReactMarkdown).prop('className')).toBe('description');
  });

  it('Should Work longer than 1 year render without crash', () => {
    const wrapper = shallow(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-01-01', end: '2020-01-31' }}
        description="foo **bar**"
      />,
    );
    expect(wrapper.find('.work')).toHaveLength(1);
    expect(wrapper.find('.work p.info')).toHaveLength(1);
    expect(wrapper.find('.work h3').contains('god')).toBe(true);
    expect(wrapper.find('.work span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.work span.company').contains('world')).toBe(true);
    expect(wrapper.find('.work span.date').contains('January 2019/January 2020/1/1')).toBe(true);
    expect(wrapper.find(ReactMarkdown)).toHaveLength(1);
    expect(wrapper.find(ReactMarkdown).prop('className')).toBe('description');
  });

  it('Should Work less than 1 year render without crash', () => {
    const wrapper = shallow(
      <Work
        city="paris"
        company="world"
        title="god"
        date={{ start: '2019-03-01', end: '2019-05-01' }}
        description="foo **bar**"
      />,
    );
    expect(wrapper.find('.work')).toHaveLength(1);
    expect(wrapper.find('.work p.info')).toHaveLength(1);
    expect(wrapper.find('.work h3').contains('god')).toBe(true);
    expect(wrapper.find('.work span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.work span.company').contains('world')).toBe(true);
    expect(wrapper.find('.work span.date').contains('March 2019/May 2019/2')).toBe(true);
    expect(wrapper.find(ReactMarkdown)).toHaveLength(1);
    expect(wrapper.find(ReactMarkdown).prop('className')).toBe('description');
  });
});
