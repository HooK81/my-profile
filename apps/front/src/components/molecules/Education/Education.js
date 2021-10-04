/**
 * Education
 */
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import upperFirst from 'lodash/upperFirst';
import './Education.scss';

/**
 * Education Component
 * @param {object} props
 */
export function Education(props) {
  const { t } = useTranslation();

  return (
    <div className="education">
      <h3>{props.degree}</h3>
      <p className="info">
        <span className="school">{props.school}</span>
      </p>
      <p className="info">
        <span className="city">{props.city}</span>
        <span>&bull;</span>
        <span className="date">
          {upperFirst(
            moment(props.date).format(t('resume.educations.date_format')),
          )}
        </span>
      </p>
    </div>
  );
}

Education.propTypes = {
  degree: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
