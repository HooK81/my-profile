import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const networkSchema = z.object({
  name: z.string(),
  url: z.url(),
  icon: z.string(),
});

export const workDateSchema = z.object({
  start: z.string(),
  end: z.string().optional(),
});

export const workSchema = z.object({
  title: z.string(),
  company: z.string(),
  city: z.string(),
  description: z.string(),
  date: workDateSchema,
});

export const educationSchema = z.object({
  degree: z.string(),
  school: z.string(),
  city: z.string(),
  date: z.string(),
});

export const skillSchema = z.object({
  name: z.string(),
  level: z.number().int(),
  showLevel: z.boolean().optional().default(true),
});

export const hobbySchema = z.object({
  title: z.string(),
  image: z.string(),
  icon: z.string(),
});

export const techSchema = z.object({
  name: z.string(),
  image: z.string(),
  desc: z.string(),
});

export const userSchema = z.object({
  lastName: z.string(),
  firstName: z.string(),
  fullName: z.string(),
  occupation: z.string(),
  description: z.string(),
  image: z.string(),
  logo: z.string(),
  bio: z.string(),
  email: z.email(),
  address: addressSchema,
  phone: z.string().optional(),
  website: z.string(),
  resumePdf: z.string(),
  networks: z.array(networkSchema),
});

export const resumeSchema = z.object({
  works: z.array(workSchema),
  educations: z.array(educationSchema),
  skills: z.array(skillSchema),
});

export const profileSchema = z.object({
  id: z.string(),
  user: userSchema,
  resume: resumeSchema,
  hobbies: z.array(hobbySchema),
  techs: z.array(techSchema),
});

export type Address = z.infer<typeof addressSchema>;
export type Network = z.infer<typeof networkSchema>;
export type WorkDate = z.infer<typeof workDateSchema>;
export type Work = z.infer<typeof workSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Hobby = z.infer<typeof hobbySchema>;
export type Tech = z.infer<typeof techSchema>;
export type User = z.infer<typeof userSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Profile = z.infer<typeof profileSchema>;
