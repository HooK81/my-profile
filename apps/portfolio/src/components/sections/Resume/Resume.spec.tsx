import { cleanup, screen } from '@testing-library/react';
import type { Resume as ResumeData } from 'my-profile-shared';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../../hooks/useInView');

import { setInView } from '../../../hooks/__mocks__/useInView';
import { useAppStore } from '../../../stores/app.store';
import { renderWithQueryClient } from '../../../test-utils';
import { calculateDuration, formatDate } from '../../../utils/date';
import Resume from './Resume';

const LOCALE = 'en';

const boldWord = 'things';

const pinnedResume: ResumeData = {
  works: [
    {
      title: 'Senior Engineer',
      company: 'Acme',
      city: 'Paris',
      description: `Built **${boldWord}**`,
      date: { start: '2020-02-01', end: '' },
    },
    {
      title: 'Developer',
      company: 'Globex',
      city: 'Lyon',
      description: 'Shipped features',
      date: { start: '2015-03-01', end: '2020-01-31' },
    },
  ],
  educations: [
    {
      degree: 'Master of Science',
      school: 'University',
      city: 'Toulouse',
      date: '2010-06-30',
    },
  ],
  skills: [
    { name: 'TypeScript', level: 90, showLevel: true },
    { name: 'Leadership', level: 100, showLevel: false },
  ],
};

const dateRange = (work: ResumeData['works'][number]) => {
  const start = formatDate(work.date.start, LOCALE);
  const end = work.date.end
    ? formatDate(work.date.end, LOCALE)
    : 'resume.date.present';
  const duration = calculateDuration(
    work.date.start,
    work.date.end || undefined,
  );

  return `${start} – ${end} (${duration})`;
};

afterEach(() => cleanup());

describe('Resume', () => {
  beforeEach(() => {
    useAppStore.setState({ locale: LOCALE });
  });

  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Resume />);

    expect(container.firstChild).toBeNull();
  });

  describe('with a generated profile', () => {
    const profile = ProfileFactory.build();
    const { works, educations, skills } = profile.resume;

    it('should render the section with id="resume" and its title', () => {
      const { container } = renderWithQueryClient(<Resume />, { profile });

      expect(container.querySelector('#resume')).not.toBeNull();
      expect(
        screen.getByRole('heading', { level: 2, name: 'resume.title' }),
      ).toBeInTheDocument();
    });

    it('should render the three column titles and the skills subtitle', () => {
      renderWithQueryClient(<Resume />, { profile });

      expect(
        screen.getByRole('heading', { level: 3, name: 'resume.experience' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: 'resume.education' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: 'skills.title' }),
      ).toBeInTheDocument();
      expect(screen.getByText('skills.desc')).toBeInTheDocument();
    });

    it('should render one timeline item per work with title, company, city and dates', () => {
      renderWithQueryClient(<Resume />, { profile });

      works.forEach((work) => {
        expect(
          screen.getAllByRole('heading', { level: 4, name: work.title }).length,
        ).toBeGreaterThan(0);
        expect(screen.getAllByText(work.company).length).toBeGreaterThan(0);
        expect(screen.getAllByText(work.city).length).toBeGreaterThan(0);
        expect(screen.getAllByText(dateRange(work)).length).toBeGreaterThan(0);
      });
    });

    it('should render one tile per education with degree, school, city and date', () => {
      renderWithQueryClient(<Resume />, { profile });

      educations.forEach((education) => {
        expect(
          screen.getAllByRole('heading', { level: 4, name: education.degree })
            .length,
        ).toBeGreaterThan(0);
        expect(screen.getAllByText(education.school).length).toBeGreaterThan(0);
        expect(screen.getAllByText(education.city).length).toBeGreaterThan(0);
        expect(
          screen.getAllByText(formatDate(education.date, LOCALE)).length,
        ).toBeGreaterThan(0);
      });
    });

    it('should render every skill name', () => {
      renderWithQueryClient(<Resume />, { profile });

      skills.forEach((skill) => {
        expect(screen.getAllByText(skill.name).length).toBeGreaterThan(0);
      });
    });

    it('should omit the education block when there is none', () => {
      renderWithQueryClient(<Resume />, {
        profile: ProfileFactory.build({ resume: { educations: [] } }),
      });

      expect(screen.queryByText('resume.education')).toBeNull();
    });
  });

  describe('with a pinned resume', () => {
    const profile = ProfileFactory.build({ resume: pinnedResume });
    const [ongoingWork, pastWork] = pinnedResume.works;
    const [shownSkill, hiddenSkill] = pinnedResume.skills;

    it('should render the markdown description with bold segments', () => {
      renderWithQueryClient(<Resume />, { profile });

      expect(screen.getByText(boldWord).tagName).toBe('STRONG');
    });

    it('should use the present label for an ongoing work and dates otherwise', () => {
      renderWithQueryClient(<Resume />, { profile });

      expect(screen.getByText(dateRange(ongoingWork))).toHaveTextContent(
        'resume.date.present',
      );
      expect(screen.getByText(dateRange(pastWork))).not.toHaveTextContent(
        'resume.date.present',
      );
    });

    it('should mark timeline items active only while in view', () => {
      const { container } = renderWithQueryClient(<Resume />, { profile });
      const items = container.querySelectorAll('.timelineItem');

      expect(items).toHaveLength(pinnedResume.works.length);
      items.forEach((item) => expect(item).not.toHaveClass('active'));

      setInView(true);
      items.forEach((item) => expect(item).toHaveClass('active'));

      setInView(false);
      items.forEach((item) => expect(item).not.toHaveClass('active'));
    });

    it('should show the level only for skills flagged as visible', () => {
      renderWithQueryClient(<Resume />, { profile });

      expect(screen.getByText(`${shownSkill.level}%`)).toBeInTheDocument();
      expect(screen.queryByText(`${hiddenSkill.level}%`)).toBeNull();
    });

    it('should grow skill bars from 0 to their level once in view', () => {
      const { container } = renderWithQueryClient(<Resume />, { profile });
      const fills = container.querySelectorAll<HTMLElement>('.skillFill');

      expect(fills).toHaveLength(pinnedResume.skills.length);
      fills.forEach((fill) => expect(fill).toHaveStyle({ width: '0%' }));

      setInView(true);

      pinnedResume.skills.forEach((skill, i) => {
        expect(fills[i]).toHaveStyle({ width: `${skill.level}%` });
      });
    });
  });
});
