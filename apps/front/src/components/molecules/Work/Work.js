/**
 * Work
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';
import ReactMarkdown from 'react-markdown';
import './Work.scss';

/**
 * Work Component
 * @param {object} props
 */
export function Work(props) {
  const { t } = useTranslation();

  const dateStart = upperFirst(moment(props.date.start).format(t("resume.works.moment_format")));
  const dateEnd = props.date.end ? upperFirst(moment(props.date.end).format(t("resume.works.moment_format"))) : t("resume.works.today");
  let durationString = "";

  // Calculate duration
  const endDate = props.date.end ? moment(props.date.end) : moment();
  const startDate = moment(props.date.start);
  const duration = moment.duration(endDate.diff(startDate));
  const years = duration.years() >= 1 ? t("resume.works.duration_years", {count: duration.years()}) : "";
  const months = duration.months() > 0 ? t("resume.works.duration_months", {count: duration.months()}) : "";
  durationString = t("resume.works.duration", {years: years, months: months}).trim();

  return (
    <div className="work">
      <h3>{props.title}</h3>
      <p className="info">
        <span className="company">{props.company}</span>
        <span>&bull;</span>
        <span className="city">{props.city}</span>
        <span className="date_separator">&bull;</span>
        <span className="date">{t("resume.works.date", {start: dateStart, end: dateEnd, duration: durationString})}</span>
      </p>
      <ReactMarkdown className="description">{props.description}</ReactMarkdown>
    </div>
  );
}

Work.propTypes = {
  company: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired
  }).isRequired,
};
