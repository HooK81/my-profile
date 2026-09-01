import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import type {
  Education,
  Facts,
  Hobby,
  Network,
  Profile,
  Resume,
  Skill,
  Tech,
  User,
  Work,
  WorkDate,
} from '../schemas/profile.schemas.js';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const WorkDateFactory = Factory.define<WorkDate>(() => {
  const startDate = faker.date.past({ years: 5 });

  return faker.datatype.boolean()
    ? ((): WorkDate => {
        const minEndDate = new Date(startDate);

        const endDate = faker.date.between({
          from: minEndDate,
          to: new Date(),
        });

        return {
          start: formatDate(startDate),
          end: formatDate(endDate),
        };
      })()
    : {
        start: formatDate(startDate),
        end: '',
      };
});

const WorkFactory = Factory.define<Work>(() => ({
  title: faker.person.jobTitle(),
  company: faker.company.name(),
  city: faker.location.city(),
  description: faker.person.jobDescriptor(),
  date: WorkDateFactory.build(),
}));

const EducationFactory = Factory.define<Education>(() => ({
  degree: faker.lorem.word(),
  school: faker.company.name(),
  city: faker.location.city(),
  date: formatDate(faker.date.past({ years: 20 })),
}));

const SkillFactory = Factory.define<Skill>(() => ({
  name: faker.lorem.word(),
  level: faker.number.int({ min: 10, max: 100 }),
  showLevel: faker.datatype.boolean(),
}));

const ResumeFactory = Factory.define<Resume>(() => ({
  works: WorkFactory.buildList(faker.number.int({ min: 3, max: 5 })),
  educations: EducationFactory.buildList(faker.number.int({ min: 3, max: 5 })),
  skills: SkillFactory.buildList(faker.number.int({ min: 5, max: 15 })),
}));

const TechFactory = Factory.define<Tech>(() => {
  const name = faker.lorem.word();
  return {
    name,
    image: `${name.toLowerCase()}.png`,
    desc: faker.lorem.sentence({ min: 5, max: 10 }),
  };
});

const HobbyFactory = Factory.define<Hobby>(() => {
  const title = faker.lorem.word();
  return {
    title,
    image: `${title.toLowerCase()}.png`,
    icon: faker.helpers.arrayElement([
      'LuFilm',
      'LuGamepad2',
      'LuBookOpenText',
    ]),
  };
});

const FactsFactory = Factory.define<Facts>(() => ({
  linesOfCode: faker.number.int({ min: 100_000, max: 2_000_000 }),
  mergeRequests: faker.number.int({ min: 50, max: 1000 }),
  trainings: faker.number.int({ min: 1, max: 20 }),
  coffees: faker.number.int({ min: 100, max: 2000 }),
}));

const NetworkFactory = Factory.define<Network>(() => {
  const name = faker.helpers.arrayElement(['twitter', 'linkedIn', 'instagram']);
  return {
    name: `${name}_${faker.number.int()}`,
    url: `https://${name}.com/${faker.internet.username()}`,
    icon: faker.helpers.arrayElement([
      'FaXTwitter',
      'FaLinkedin',
      'FaInstagram',
    ]),
  };
});

const UserFactory = Factory.define<User>(() => {
  const user = {
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
  };

  return {
    lastName: user.lastName,
    firstName: user.firstName,
    fullName: `${user.lastName} ${user.firstName}`,
    occupation: faker.person.jobTitle(),
    description: faker.lorem.paragraphs(2, '  \n'),
    image: `${faker.system.fileName().split('.')[0]}.jpg`,
    logo: `${faker.system.fileName().split('.')[0]}.svg`,
    bio: faker.lorem.sentence(),
    email: faker.internet.email(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      country: faker.location.country(),
    },
    phone: faker.phone.number({ style: 'international' }),
    website: `https://www.${faker.internet.domainName()}`,
    resumePdf: `${faker.system.fileName().split('.')[0]}.pdf`,
    networks: NetworkFactory.buildList(faker.number.int({ min: 1, max: 3 })),
    facts: FactsFactory.build(),
  };
});

export const ProfileFactory = Factory.define<Profile>(() => ({
  id: faker.string.uuid(),
  user: UserFactory.build(),
  hobbies: HobbyFactory.buildList(faker.number.int({ min: 1, max: 5 })),
  techs: TechFactory.buildList(faker.number.int({ min: 1, max: 5 })),
  resume: ResumeFactory.build(),
}));
