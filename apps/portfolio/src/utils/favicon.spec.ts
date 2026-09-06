import { applyFavicon } from './favicon';

const DATA_URL_PREFIX = 'data:image/svg+xml;charset=utf-8,';

const getIconLink = () =>
  document.querySelector<HTMLLinkElement>('link[rel="icon"]');

const appliedSvg = () => {
  const { href } = getIconLink()!;
  expect(href.startsWith(DATA_URL_PREFIX)).toBe(true);

  return decodeURIComponent(href.slice(DATA_URL_PREFIX.length));
};

afterEach(() => {
  getIconLink()?.remove();
});

describe('applyFavicon()', () => {
  it('should create an svg icon link when none exists', () => {
    expect(getIconLink()).toBeNull();

    applyFavicon('JC');

    const link = getIconLink();
    expect(link).not.toBeNull();
    expect(link!.type).toBe('image/svg+xml');
    expect(appliedSvg()).toMatch(/^<svg /);
  });

  it('should update the existing icon link in place', () => {
    const existing = document.createElement('link');
    existing.rel = 'icon';
    existing.href = '/favicon.svg';
    document.head.appendChild(existing);

    applyFavicon('AB');

    expect(document.querySelectorAll('link[rel="icon"]')).toHaveLength(1);
    expect(existing.href.startsWith(DATA_URL_PREFIX)).toBe(true);
  });

  it('should draw the initials on the brand gradient square', () => {
    const initials = 'JC';

    applyFavicon(initials);

    const svg = appliedSvg();
    expect(svg).toContain(`>${initials}</text>`);
    expect(svg).toContain('<linearGradient');
    expect(svg).toContain('fill="url(#g)"');
  });

  it('should escape XML special characters in the initials', () => {
    applyFavicon('<&');

    expect(appliedSvg()).toContain('>&lt;&amp;</text>');
  });
});
