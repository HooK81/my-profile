/**
 * ProtectedText
 * @author Julien CROCHET <julien@crochet.me>
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Style from 'style-it';

/**
 * ProtectedText Component
 * @param object props
 */
export function ProtectedText(props) {
  function strSplitIn3(str, size) {
    if (!str) return [];
    str = String(str);
    size = ~~size;
    return size > 0 ? str.match(new RegExp('.{1,' + size + '}', 'g')) : [str];
  }

  function replaceWrapper(str) {
    return str
      .replace('(', ')')
      .replace(')', '(')
      .replace('{', '}')
      .replace('}', '{')
      .replace('[', ']')
      .replace(']', '[');
  }

  const [domText, setDomText] = useState('');
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState('');

  useEffect(() => {
    const reverse = props.text ? replaceWrapper([...props.text].reverse().join('')) : '';
    const splitLen = Math.max(1, Math.ceil(reverse.length / 3));
    const split = strSplitIn3(reverse, splitLen);
    setBeforeText(split[0] ? split[0] : '');
    setDomText(split[1] ? split[1] : '');
    setAfterText(split[2] ? split[2] : '');
  }, [props.text]);

  if (!beforeText) return null; // empty string

  return (
    <Style>
      {`
        span {
          unicode-bidi: bidi-override;
          direction: rtl;
        }
        span:before {
          content: "${beforeText}"
        }
        span:after {
          content: "${afterText}"
        }
      `}
      <span className={'protected-text ' + props.protectedClassName}>
        <span>{domText}</span>
      </span>
    </Style>
  );
}

ProtectedText.defaultProps = {
  protectedClassName: '',
};
ProtectedText.propTypes = {
  text: PropTypes.string.isRequired,
  protectedClassName: PropTypes.string,
};
