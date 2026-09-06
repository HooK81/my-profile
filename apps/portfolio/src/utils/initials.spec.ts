import { getInitials } from './initials';

describe('getInitials', () => {
  it('should return the first letter of the first two words', () => {
    expect(getInitials('Julien Crochet')).toBe('JC');
    expect(getInitials('Doe John')).toBe('DJ');
  });

  it('should return a single letter for a single word', () => {
    expect(getInitials('Test')).toBe('T');
  });

  it('should uppercase, ignore extra spaces and cap at two letters', () => {
    expect(getInitials('  jean  pierre martin ')).toBe('JP');
  });

  it('should return an empty string for an empty name', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });
});
