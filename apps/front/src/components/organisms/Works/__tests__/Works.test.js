/**
 * Works Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Works } from '../Works.js';
import { Work } from '../../../molecules/Work/Work.js';

describe('Works', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Educations render without crash', () => {
    const works = [{city: "paris", company: "world", title: "good", description: "desc", date: {start: "2019-01-01", end: "2019-12-31"}}, {city: "paris", company: "world", title: "good", description: "desc", date: {start: "2019-01-01", end: "2019-12-31"}}];
    const wrapper = shallow(<Works works={works} />);

    expect(wrapper.find('.works')).toHaveLength(1);
    expect(wrapper.find(Work)).toHaveLength(2);
  });
});
