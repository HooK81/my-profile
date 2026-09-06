import { z } from 'zod';

export const iconSchema = z.enum([
  'FaFacebook',
  'FaGithub',
  'FaInstagram',
  'FaLinkedin',
  'FaXTwitter',
  'LuBookOpenText',
  'LuCamera',
  'LuChevronDown',
  'LuCode',
  'LuContact',
  'LuCoffee',
  'LuDownload',
  'LuFilm',
  'LuGamepad2',
  'LuGitPullRequestArrow',
  'LuGraduationCap',
  'LuLightbulb',
  'LuLoaderCircle',
  'LuMail',
  'LuMapPin',
  'LuMoon',
  'LuMusic4',
  'LuPlane',
  'LuRocket',
  'LuSend',
  'LuSmartphone',
  'LuSun',
  'LuWatch',
]);

export type IconName = z.infer<typeof iconSchema>;
