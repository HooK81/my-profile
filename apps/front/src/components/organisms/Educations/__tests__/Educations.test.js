/**
 * Educations Test Suites
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Educations } from '../Educations.js';
import { Education } from '../../../molecules/Education/Education.js';

describe('Educations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Educations render without crash', () => {
    const educations = [{city: "paris", degree: "foo", school: "bar", date: "june"}, {city: "paris", degree: "foo", school: "bar", date: "june"}];
    const wrapper = shallow(<Educations educations={educations} />);

    expect(wrapper.find('.educations')).toHaveLength(1);
    expect(wrapper.find(Education)).toHaveLength(2);
  });
});
