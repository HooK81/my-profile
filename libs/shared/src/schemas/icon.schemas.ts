import { z } from 'zod';

export const iconSchema = z.enum([
  'FaFacebook',
  'FaGithub',
  'FaInstagram',
  'FaLinkedin',
  'FaXTwitter',
  'LuBookOpenText',
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
  'LuRocket',
  'LuSmartphone',
]);

export type IconName = z.infer<typeof iconSchema>;
