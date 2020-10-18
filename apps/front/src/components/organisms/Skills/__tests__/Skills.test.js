/**
 * Skills Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Skills } from '../Skills.js';
import { Bars } from '../../../molecules/Bars/Bars.js';
import { getWindowResolution } from '../../../../utils/window';

jest.mock('../../../../utils/window');

describe('Skills One Column', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getWindowResolution.mockReturnValue({
      width: 500,
      height: 800
    });
  });

  it('Should Skills render without crash', () => {
    const skills = [{name: "foo", level: "50%"}, {name: "bar", level: "25%"}];
    const wrapper = shallow(<Skills skills={skills} t={key => key}/>);

    expect(wrapper.find('.skills')).toHaveLength(1);
    expect(wrapper.find(Bars)).toHaveLength(1);
  });
});

describe('Skills Tow Column', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getWindowResolution.mockReturnValue({
      width: 1200,
      height: 1024
    });
  });

  it('Should Skills render without crash', () => {
    const skills = [{name: "foo", level: "50%"}, {name: "bar", level: "25%"}];
    const wrapper = shallow(<Skills skills={skills} t={key => key}/>);

    expect(wrapper.find('.skills')).toHaveLength(1);
    expect(wrapper.find(Bars)).toHaveLength(2);
  });
});
