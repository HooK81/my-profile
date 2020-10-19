/**
 * Footer Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import { shallow } from 'enzyme';
import { Footer } from '../Footer';
import { SocialLinks } from '../../../molecules/SocialLinks/SocialLinks';
import { ScrollButton } from '../../../atoms/ScrollButton/ScrollButton';

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Footer render without crash', () => {
    const wrapper = shallow(<Footer profileMain={{social: [], fullName: 'John DOE'}} />);
    expect(wrapper.find('footer')).toHaveLength(1);
    expect(wrapper.find(SocialLinks)).toHaveLength(1);
    expect(wrapper.find(ScrollButton)).toHaveLength(1);
    expect(wrapper.find('.copyright li').text()).toMatch('John DOE');
  });
});
