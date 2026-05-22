import type { IconName } from 'my-profile-shared';
import type { IconType } from 'react-icons';
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  LuBookOpenText,
  LuCamera,
  LuCode,
  LuCoffee,
  LuDownload,
  LuFilm,
  LuGamepad2,
  LuGitPullRequestArrow,
  LuGraduationCap,
  LuLightbulb,
  LuMail,
  LuMapPin,
  LuMusic4,
  LuPlane,
  LuRocket,
  LuSmartphone,
  LuWatch,
} from 'react-icons/lu';

const ICONS: Record<IconName, IconType> = {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  LuBookOpenText,
  LuCode,
  LuCoffee,
  LuDownload,
  LuFilm,
  LuGamepad2,
  LuGitPullRequestArrow,
  LuGraduationCap,
  LuLightbulb,
  LuMail,
  LuMapPin,
  LuMusic4,
  LuCamera,
  LuPlane,
  LuRocket,
  LuSmartphone,
  LuWatch,
};

interface IconProps {
  name: IconName;
  className?: string;
}

function Icon({ name, className }: IconProps) {
  const Component = ICONS[name];
  return <Component className={className} aria-hidden />;
}

export default Icon;
