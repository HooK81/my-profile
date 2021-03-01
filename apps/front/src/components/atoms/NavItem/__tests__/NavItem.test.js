/**
 * ProfilePicture Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, mount} from 'enzyme';
import { NavItem } from '../NavItem.js';

describe('NavItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML =
      '<div style="height: 5000px;"><div id="upper" style="height: 4000px;">test</div><div id="hash">hash</div></div>';
  });

  it('Should NavItem render link to inner hash without crash', async () => {
    const onItemSelect = jest.fn();
    const onSetActive = jest.fn();

    // Mock rect of hash element
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 500,
      bottom: 1000,
      width: 500,
      height: 1000
    }));

    const wrapper = mount(
      <NavItem
        label="label"
        to={{ pathname: '/', hash: 'hash' }}
        activeClass="active"
        smoothDuration={1}
        smoothOffset={0}
        onSetActive={onSetActive}
        onItemSelect={onItemSelect}
      />,
    );
    const dom = wrapper.find('li > Link');
    expect(dom).toHaveLength(1);

    // Click on link
    dom.simulate('click');

    await new Promise(done => setTimeout(() => {
      expect(onItemSelect).toHaveBeenCalled();
      expect(onSetActive).toHaveBeenCalled();
      done();
    }, 1000));
  });

  it('Should NavItem handle click on wrong inner hash link', async () => {
    const onItemSelect = jest.fn();
    const onSetActive = jest.fn();
    const onScrollLinkError = jest.fn();

    // Mock rect of hash element
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 500,
      bottom: 1000,
      width: 500,
      height: 1000
    }));

    const wrapper = mount(
      <NavItem
        label="label"
        to={{ pathname: '/', hash: 'foo' }}
        activeClass="active"
        smoothDuration={1}
        smoothOffset={0}
        onSetActive={onSetActive}
        onItemSelect={onItemSelect}
        onScrollLinkError={onScrollLinkError}
      />,
    );
    const dom = wrapper.find('li > Link');
    expect(dom).toHaveLength(1);

    // Click on link
    dom.simulate('click');

    await new Promise(done => setTimeout(() => {
      expect(onItemSelect).toHaveBeenCalled();
      expect(onScrollLinkError).toHaveBeenCalled();
      expect(onSetActive).not.toHaveBeenCalled();
      done();
    }, 1000));
  });

  it('Should NavItem render link to other page without crash', () => {
    const onItemSelect = jest.fn();

    const wrapper = shallow(
      <NavItem label="label" to={{ pathname: '/other' }} onItemSelect={onItemSelect} />
    );
    const dom = wrapper.find('li > NavHashLink');
    expect(dom).toHaveLength(1);
    dom.simulate('click');
    expect(onItemSelect).toHaveBeenCalled();
  });
});
