/**
 * Resume Test Suites
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Resume } from '../Resume.js';
import { Skills } from '../../../organisms/Skills/Skills';
import { Educations } from '../../../organisms/Educations/Educations';
import { Works } from '../../../organisms/Works/Works';

describe('Resume', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Resume render without crash', () => {
    const wrapper = shallow(<Resume />);
    expect(wrapper.find('section#resume')).toHaveLength(1);
    expect(wrapper.find(Skills)).toHaveLength(1);
    expect(wrapper.find(Educations)).toHaveLength(1);
    expect(wrapper.find(Works)).toHaveLength(1);
  });
});
