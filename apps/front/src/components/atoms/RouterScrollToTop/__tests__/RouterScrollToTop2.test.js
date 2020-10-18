/**
 * RouterScrollToTop Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from "react";
import { mount } from "enzyme";
import { RouterScrollToTop } from "../RouterScrollToTop.js";

window.scrollTo = jest.fn();

describe('RouterScrollToTop home', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("Should RouterScrollToTop not call scrollTop on page change", () => {
    const wrapper = mount(<RouterScrollToTop><div id="child"></div></RouterScrollToTop>);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

