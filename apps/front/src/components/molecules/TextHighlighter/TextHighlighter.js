/**
 * TextHighlighter
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

/**
 * TextHighlighter Component
 * By deault text to highlight must be wrapped by '**'
 * @param {object} props
 * @example
 * <TextHighlighter textToHighlight="foo **bar**" />
 */
export function TextHighlighter(props) {
  const [stateSearchWords, setStateSearchWords] = useState([]);
  const [stateText, setStateText] = useState('');

  function escapeTag(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  useEffect(() => {
    // Get Values from props
    let tagStart = props.tagStart;
    let tagEnd = props.tagEnd;
    let searchWords = props.searchWords ? props.searchWords : [];
    const tag = props.tag;
    const textToHighlight = props.textToHighlight;
    if (!tagStart) {
      tagStart = tag;
      tagEnd = tag;
    }

    // Extract words to highlight
    function extractTextToHighlight() {
      const regExpStr = escapeTag(tagStart) + '([\\w\\s\\d]+)' + escapeTag(tagEnd);
      const regExp = new RegExp(regExpStr, 'g');
      let match = regExp.exec(textToHighlight);
      while (match != null) {
        searchWords.push(match[1]);
        match = regExp.exec(textToHighlight);
      }

      // Remove tags from original text
      setStateText(textToHighlight.replace(regExp, '$1'));
      setStateSearchWords(searchWords);
    }

    extractTextToHighlight();
  }, [props.textToHighlight, props.searchWords, props.tag, props.tagEnd, props.tagStart]);

  const { tagStart, tagEnd, tag, textToHighlight, searchWords, ...otherProps } = props;

  return <Highlighter textToHighlight={stateText} searchWords={stateSearchWords} {...otherProps} />;
}

TextHighlighter.defaultProps = {
  tag: '**',
  highlightClassName: '',
};

TextHighlighter.propTypes = {
  tagStart: PropTypes.string,
  tagEnd: PropTypes.string,
  tag: PropTypes.string,
  textToHighlight: PropTypes.string.isRequired,
  searchWords: PropTypes.array,
  highlightClassName: PropTypes.string,
};
