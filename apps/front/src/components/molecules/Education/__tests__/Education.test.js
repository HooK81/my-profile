/**
 * Education Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, render } from 'enzyme';
import moment from 'moment'
import { Education } from '../Education.js';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: key => key === 'resume.educations.date_format' ? 'MMMM YYYY' : key,
  }),
}));

describe('Educations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Education render without crash', () => {
    const wrapper = shallow(<Education city="paris" degree="foo" school="bar" date="2020-10-01" />);

    expect(wrapper.find('.education')).toHaveLength(1);
    expect(wrapper.find('.education p.info')).toHaveLength(2);
    expect(wrapper.find('.education h3').contains('foo')).toBe(true);
    expect(wrapper.find('.education span.city').contains('paris')).toBe(true);
    expect(wrapper.find('.education span.school').contains('bar')).toBe(true);
    expect(wrapper.find('.education span.date').contains('October 2020')).toBe(true);
  });
});
