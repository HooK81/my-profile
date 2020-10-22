/**
 * ProtectedText
 * @author Julien CROCHET <julien@crochet.me>
 */

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Style from 'style-it';

/**
 * ProtectedText Component
 * @param object props
 */
export function ProtectedText(props) {
  const [domText, setDomText] = useState('');
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState('');

  /**
   * Reverse and split the text
   * @returns array
   */
  const reverseAndSplit = useCallback(() => {
    const reverse = reverseWrappers(props.text.split('').reverse().join(''));
    const parts = split(reverse);

    return parts;
  }, [props.text]);

  /**
   * Split text in 3 parts
   * @param {string} str Text
   * @returns array
   */
  function split(str) {
    if (!str) return [];
    const size = Math.max(1, Math.ceil(str.length / 3));
    str = String(str);

    return str.match(new RegExp(`.{1,${size}}`, 'g'));
  }

  /**
   * Reverse common wrappers
   * @param {Re} str
   */
  function reverseWrappers(str) {
    return str
      .replace('(', ')')
      .replace(')', '(')
      .replace('{', '}')
      .replace('}', '{')
      .replace('[', ']')
      .replace(']', '[');
  }

  /**
   * Set the text parts into state
   */
  useEffect(() => {
    const parts = reverseAndSplit();
    setBeforeText(parts[0] ? parts[0] : '');
    setDomText(parts[1] ? parts[1] : '');
    setAfterText(parts[2] ? parts[2] : '');
  }, [props.text, reverseAndSplit]);

  /**
   * Render Text
   */
  function renderText() {
    const { text, href, customClassName, protectedHref, hrefHeaders, ...others } = props;

    return <span {...others}>{domText}</span>;
  }

  /**
   * Render Link
   */
  function renderLink() {
    const { text, href, customClassName, protectedHref, hrefHeaders, ...others } = props;

    return (
      <a href={props.protectedHref} onClick={onLinkClick} {...others}>
        {domText}
      </a>
    );
  }

  /**
   * Handle click on Link
   * @param {Event} event
   */
  function onLinkClick(event) {
    event.preventDefault();
    let headers = '';
    if (props.hrefHeaders) {
      headers =
        '?' +
        Object.keys(props.hrefHeaders)
          .map((key) => `${key}=${encodeURIComponent(props.hrefHeaders[key])}`)
          .join('&');
    }

    if (event.metaKey || event.ctrlKey) {
      window.open(props.href + headers, '_blank');
    } else {
      window.location.assign(props.href + headers);
    }
  }

  if (!beforeText) return null; // empty string, nothing to render

  // Render Component
  return (
    <Style>
      {`
        * {
          unicode-bidi: bidi-override;
          direction: rtl;
        }
        *:before {
          content: "${beforeText}"
        }
        *:after {
          content: "${afterText}"
        }
      `}
      <span className={`protected-text ${props.className}`}>
        {!props.href && renderText()}
        {props.href && renderLink()}
      </span>
    </Style>
  );
}
export default ProtectedText;

ProtectedText.defaultProps = {
  text: '',
  href: '',
  className: '',
  protectedHref: 'https://click',
};
ProtectedText.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string,
  hrefHeaders: PropTypes.object,
  className: PropTypes.string,
  protectedHref: PropTypes.string,
};
