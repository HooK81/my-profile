/**
 * Bars
 */
import React from 'react';
import PropTypes from 'prop-types';
import './Bars.scss';

/**
 * Bars Component
 * @param {object} props
 */
export function Bars(props) {
  const items = props.items.map(function (skills) {
    return (
      <li key={skills.name}>
        <span
          style={{ width: `${skills.level}%` }}
          className="bar-expand"
        ></span>
        <em>{skills.name}</em>
      </li>
    );
  });

  return (
    <div className="bars">
      <ul>{items}</ul>
    </div>
  );
}

/* istanbul ignore next */
Bars.propTypes = {
  items: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    _location,
    propName,
  ) {
    if (!('name' in propValue[key]) || !('level' in propValue[key])) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  }).isRequired,
};
