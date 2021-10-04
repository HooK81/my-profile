/**
 * Resume
 */
import PropTypes from 'prop-types';
import './Resume.scss';
import { Skills } from '../../organisms/Skills/Skills';
import { Educations } from '../../organisms/Educations/Educations';
import { Works } from '../../organisms/Works/Works';

/**
 * Resume Component
 * @param {object} props
 */
export function Resume(props) {
  return (
    <section id="resume">
      <Works works={props.resume.works} />
      <Educations educations={props.resume.educations} />
      <Skills skills={props.resume.skills} />
    </section>
  );
}

Resume.defaultProps = {
  resume: {
    works: [],
    educations: [],
    skills: [],
  },
};
Resume.propTypes = {
  resume: PropTypes.shape({
    works: PropTypes.array,
    educations: PropTypes.array,
    skills: PropTypes.array,
  }).isRequired,
};
