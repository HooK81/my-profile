/**
 * ScrollButton Test Suites
 */

import React from "react";
import { shallow, mount } from "enzyme";
import { ScrollButton } from "../ScrollButton.js";

describe('ScrollButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should ScrollButton top render without crash", () => {
    const wrapper = shallow(<ScrollButton type="top" />);
    expect(wrapper.find('i.fa-angle-up')).toHaveLength(1);
    wrapper.find('i.fa-angle-up').simulate('click');
  });

  it("Should ScrollButton down render without crash", () => {
    const wrapper = mount(<ScrollButton type="down" linkTo="href"/>);
    expect(wrapper.find('i.fa-chevron-circle-down')).toHaveLength(1);
  });

});
