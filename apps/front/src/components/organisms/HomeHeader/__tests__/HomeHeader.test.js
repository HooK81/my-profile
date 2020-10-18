/**
 * HomeHeader Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { HomeHeader } from '../HomeHeader.js';
import { ScrollButton } from '../../../atoms/ScrollButton/ScrollButton';
import { SocialLinks } from '../../../molecules/SocialLinks/SocialLinks';
import { TextHighlighter } from '../../../molecules/TextHighlighter/TextHighlighter';

describe('HomeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should HomeHeader render without crash', () => {
    const wrapper = shallow(<HomeHeader />);
    expect(wrapper.find('.banner')).toHaveLength(1);
    expect(wrapper.find(ScrollButton)).toHaveLength(1);
    expect(wrapper.find(SocialLinks)).toHaveLength(1);
    expect(wrapper.find(TextHighlighter)).toHaveLength(1);
  });
});
