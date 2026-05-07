import About from '../../components/sections/About/About';
import Contact from '../../components/sections/Contact/Contact';
import Facts from '../../components/sections/Facts/Facts';
import Hero from '../../components/sections/Hero/Hero';
import Hobbies from '../../components/sections/Hobbies/Hobbies';
import Resume from '../../components/sections/Resume/Resume';
import Techs from '../../components/sections/Techs/Techs';
import { useScrollSpy } from '../../hooks/useScrollSpy';

function Home() {
  useScrollSpy();

  return (
    <>
      <Hero />
      <About />
      <Facts />
      <Resume />
      <Techs />
      <Hobbies />
      <Contact />
    </>
  );
}

export default Home;
