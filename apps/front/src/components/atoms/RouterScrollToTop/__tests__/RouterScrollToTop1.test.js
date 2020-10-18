/**
 * RouterScrollToTop Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from "react";
import { mount } from "enzyme";
import { setDefaultLcationMock } from 'react-router-dom';
import { RouterScrollToTop } from "../RouterScrollToTop.js";

window.scrollTo = jest.fn();

describe('RouterScrollToTop hot home', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    setDefaultLcationMock({
      pathname: "/foo"
    });
  });

  it("Should RouterScrollToTop call scrollTop on page change", () => {
    const wrapper = mount(<RouterScrollToTop><div id="child"></div></RouterScrollToTop>);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

