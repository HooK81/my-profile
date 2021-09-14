/**
 * Home
 */
import React from 'react';
import PropTypes from 'prop-types';
import './Home.scss';

import { Header } from '../../organisms/Header/Header';
import { HomeHeader } from '../../organisms/HomeHeader/HomeHeader';
import { About } from '../../organisms/About/About';
import { Resume } from '../../pages/Resume/Resume';
import { Hobbies } from '../../organisms/Hobbies/Hobbies';
import { Techs } from '../../organisms/Techs/Techs';
import { Contact } from '../../organisms/Contact/Contact';

/**
 * Home Page
 * @param {object} props
 */
export function Home(props) {
  return (
    <div>
      <Header id="home" home={true}>
        <HomeHeader profileMain={props.profile.main} />
      </Header>
      <About profileMain={props.profile.main} />
      <Resume resume={props.profile.resume} />
      <Techs techs={props.profile.techs} />
      <Hobbies hobbies={props.profile.hobbies} />
      <Contact profileMain={props.profile.main} />
    </div>
  );
}

Home.defaultProps = {
  profile: {
    main: {},
    resume: {},
    techs: [],
    hobbies: [],
  },
};
Home.propTypes = {
  profile: PropTypes.object.isRequired,
};
