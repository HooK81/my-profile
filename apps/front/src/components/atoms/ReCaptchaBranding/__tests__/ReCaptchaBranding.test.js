/**
 * ReCaptchaBranding Test Suites
 */

import React from "react";
import { shallow } from "enzyme";
import { ReCaptchaBranding } from "../ReCaptchaBranding.js";

describe('ReCaptchaBranding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should ReCaptchaBranding render without crash", () => {
    const wrapper = shallow(<ReCaptchaBranding />);
    expect(wrapper.find('small')).toHaveLength(1);
    expect(wrapper.find('a')).toHaveLength(2);
  });

});
