/**
 * ProfilePicture Test Suites
 */

import React from "react";
import { shallow } from "enzyme";
import { ProfilePicture } from "../ProfilePicture.js";

describe('ProfilePicture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should ProfilePicture render URL without crash", () => {
    const wrapper = shallow(<ProfilePicture name="test" data="foo" />);
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find('img').filter({ src: "data:;base64,foo" })).toHaveLength(1);
  });

  it("Should ProfilePicture render URL without crash", () => {
    const wrapper = shallow(<ProfilePicture name="test" url="/foo.jpg" />);
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find('img').filter({ src: "/foo.jpg" })).toHaveLength(1);
  });

});
