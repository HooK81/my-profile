/**
 * Footer Test Suites
 */
import React from 'react';
import { shallow } from 'enzyme';
import { ProtectedText } from 'react-protected-text';
import { Footer } from '../Footer';
import { SocialLinks } from '../../../molecules/SocialLinks/SocialLinks';
import { ScrollButton } from '../../../atoms/ScrollButton/ScrollButton';

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Footer render without crash', () => {
    const wrapper = shallow(<Footer profileMain={{networks: [], fullName: 'John DOE'}} />);
    expect(wrapper.find('footer')).toHaveLength(1);
    expect(wrapper.find(SocialLinks)).toHaveLength(1);
    expect(wrapper.find(ScrollButton)).toHaveLength(1);
    expect(wrapper.find('.copyright li').find(ProtectedText)).toHaveLength(1);
  });
});
