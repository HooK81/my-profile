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
  LuChevronDown,
  LuCode,
  LuCoffee,
  LuContact,
  LuDownload,
  LuFilm,
  LuGamepad2,
  LuGitPullRequestArrow,
  LuGraduationCap,
  LuLightbulb,
  LuLoaderCircle,
  LuMail,
  LuMapPin,
  LuMoon,
  LuMusic4,
  LuPlane,
  LuRocket,
  LuSend,
  LuSmartphone,
  LuSun,
  LuWatch,
} from 'react-icons/lu';

const ICONS: Record<IconName, IconType> = {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  LuBookOpenText,
  LuCamera,
  LuChevronDown,
  LuCode,
  LuContact,
  LuCoffee,
  LuDownload,
  LuFilm,
  LuGamepad2,
  LuGitPullRequestArrow,
  LuGraduationCap,
  LuLightbulb,
  LuLoaderCircle,
  LuMail,
  LuMapPin,
  LuMoon,
  LuMusic4,
  LuPlane,
  LuRocket,
  LuSend,
  LuSmartphone,
  LuSun,
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
