/**
 * VCardButton Test Suites
 */

import React from 'react';
import { api } from '../../../../api/index';
import { shallow, mount } from 'enzyme';
import { VCardButton } from '../VCardButton';

// Mock API
jest.mock('../../../../api/index');

describe('VCardButton', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should VCardButton render without crash', () => {
    const wrapper = shallow(<VCardButton />);
    expect(wrapper.find('.vcard')).toHaveLength(1);
    expect(wrapper.find('.vcard').find('i')).toHaveLength(1);
  });

  it('Should VCardButton render with a className', () => {
    const wrapper = shallow(<VCardButton className="test" />);

    expect(wrapper.find('.vcard.test')).toHaveLength(1);
  });

  it('Should VCardButton get URL for VCard', () => {
    api.buildUrl.mockReturnValue("api.url");

    const wrapper = mount(<VCardButton />);
    expect(wrapper.find('.vcard')).toHaveLength(1);
    expect(wrapper.find('.vcard').prop('href')).toBe('api.url');
  });

});
