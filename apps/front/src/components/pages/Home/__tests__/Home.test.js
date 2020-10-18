/**
 * Home Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Home } from '../Home.js';
import { Header } from '../../../organisms/Header/Header';
import { HomeHeader } from '../../../organisms/HomeHeader/HomeHeader';
import { About } from '../../../organisms/About/About';
import { Resume } from '../../../pages/Resume/Resume';
import { Hobbies } from '../../../organisms/Hobbies/Hobbies';
import { Techs } from '../../../organisms/Techs/Techs';
import Contact from '../../../organisms/Contact/Contact';

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Home render without crash', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find(Header)).toHaveLength(1);
    expect(wrapper.find('#home')).toHaveLength(1);
    expect(wrapper.find(About)).toHaveLength(1);
    expect(wrapper.find(Resume)).toHaveLength(1);
    expect(wrapper.find(Techs)).toHaveLength(1);
    expect(wrapper.find(Hobbies)).toHaveLength(1);
    expect(wrapper.find(Contact)).toHaveLength(1);
  });
});
