import { z } from 'zod';

export const iconSchema = z.enum([
  'FaFacebook',
  'FaGithub',
  'FaInstagram',
  'FaLinkedin',
  'FaXTwitter',
  'LuBookOpenText',
  'LuCamera',
  'LuCode',
  'LuCoffee',
  'LuDownload',
  'LuFilm',
  'LuGamepad2',
  'LuGitPullRequestArrow',
  'LuGraduationCap',
  'LuLightbulb',
  'LuMail',
  'LuMapPin',
  'LuMusic4',
  'LuPlane',
  'LuRocket',
  'LuSmartphone',
  'LuWatch',
]);

export type IconName = z.infer<typeof iconSchema>;
