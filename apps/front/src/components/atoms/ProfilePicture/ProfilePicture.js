/**
 * ProfilePicture
 */
import PropTypes from 'prop-types';
import './ProfilePicture.scss';

/**
 * ProfilePicture Component
 * @param {object} props
 */
export function ProfilePicture(props) {
  return (
    <img
      className="profile-pic"
      src={props.data ? `data:;base64,${props.data}` : props.url}
      alt={props.name}
    />
  );
}

ProfilePicture.propTypes = {
  url: PropTypes.string,
  data: PropTypes.string,
  name: PropTypes.string.isRequired,
};
