/**
 * TextHighlighter Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from "react";
import { shallow, mount } from "enzyme";
import { TextHighlighter } from "../TextHighlighter.js";
import Highlighter from 'react-highlight-words';

describe('TextHighlighter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should TextHighlighter render without crash", () => {
    const wrapper = mount(<TextHighlighter textToHighlight="foo bar" searchWords={["bar"]} />);
    expect(wrapper.find(Highlighter).prop('textToHighlight')).toBe("foo bar");
    expect(wrapper.find(Highlighter).prop('searchWords')).toEqual(["bar"]);
  });

  it("Should TextHighlighter with default tag render without crash", () => {
    const wrapper = mount(<TextHighlighter textToHighlight="foo **bar**" />);
    expect(wrapper.find(Highlighter).prop('textToHighlight')).toBe("foo bar");
    expect(wrapper.find(Highlighter).prop('searchWords')).toEqual(["bar"]);
  });

  it("Should TextHighlighter with tag render without crash", () => {
    const wrapper = mount(<TextHighlighter textToHighlight="foo %bar%" tag="%" />);
    expect(wrapper.find(Highlighter).prop('textToHighlight')).toBe("foo bar");
    expect(wrapper.find(Highlighter).prop('searchWords')).toEqual(["bar"]);
  });

  it("Should TextHighlighter with start and end tag render without crash", () => {
    const wrapper = mount(<TextHighlighter textToHighlight="foo {bar}" tagStart="{" tagEnd="}" />);
    expect(wrapper.find(Highlighter).prop('textToHighlight')).toBe("foo bar");
    expect(wrapper.find(Highlighter).prop('searchWords')).toEqual(["bar"]);
  });

});
