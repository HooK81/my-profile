/**
 * Contact Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Contact from '../Contact.js';
import ReCAPTCHA from 'react-google-recaptcha';
import { api } from '../../../../api/index';

const profileMain = {
  fullName: '',
  email: '',
  phone: '',
  address: {
    country: '',
    city: '',
    zip: '',
    street: '',
  },
};

jest.mock('../../../../api/index');

describe('Contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Contact render without crash', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    expect(wrapper.find('section#contact')).toHaveLength(1);
    expect(wrapper.find(ReCAPTCHA)).toHaveLength(1);
    expect(wrapper.find('.btn-submit').prop('disabled')).toBe(true);
  });

  it('Should Contact can send en email', () => {
    api.post.mockResolvedValue({});

    const wrapper = mount(<Contact profileMain={profileMain} />);

    wrapper.find('#contactEmail').simulate('change', { target: { name: 'email', value: 'fakeMail@fake.com' } });
    expect(wrapper.find('#contactEmail').prop('value')).toBe('fakeMail@fake.com');

    wrapper.find('#contactMessage').simulate('change', { target: { name: 'message', value: 'foo' } });
    expect(wrapper.find('#contactMessage').prop('value')).toBe('foo');

    wrapper.find('#contactSubject').simulate('change', { target: { name: 'fakeCheckbox', type: 'checkbox', checked: true } });
    expect(wrapper.state().fakeCheckbox).toBe(true);

    wrapper.find('#contactSubject').simulate('change', { target: { name: 'subject', value: 'bar' } });
    expect(wrapper.find('#contactSubject').prop('value')).toBe('bar');

    wrapper.setState({ verified: true });
    wrapper.setState({ recaptchaResponse: 'baz' });
    wrapper.update();

    expect(wrapper.find('.btn-submit').prop('disabled')).toBe(false);
    wrapper.find('#contactForm').simulate('submit');
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it('Should Contact show a toast when send email fails', async () => {
    api.post.mockRejectedValue({});

    const wrapper = mount(<Contact profileMain={profileMain} />);

    wrapper.find('#contactEmail').simulate('change', { target: { name: 'email', value: 'fakeMail@fake.com' } });
    expect(wrapper.find('#contactEmail').prop('value')).toBe('fakeMail@fake.com');

    wrapper.find('#contactMessage').simulate('change', { target: { name: 'message', value: 'foo' } });
    expect(wrapper.find('#contactMessage').prop('value')).toBe('foo');

    wrapper.find('#contactSubject').simulate('change', { target: { name: 'subject', value: 'bar' } });
    expect(wrapper.find('#contactSubject').prop('value')).toBe('bar');

    wrapper.setState({ verified: true });
    wrapper.setState({ recaptchaResponse: 'baz' });

    wrapper.update();
    expect(wrapper.find('.btn-submit').prop('disabled')).toBe(false);

    wrapper.find('#contactForm').simulate('submit');
    expect(api.post).toHaveBeenCalledTimes(1);

    await new Promise((done) =>
      setTimeout(() => {
        expect(wrapper.state().verified).toBe(false);
        done();
      }, 500),
    );
  });

  it('Should captcha can be verified', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    const instance = wrapper.instance();
    spyOn(instance, 'onVerify').and.callThrough();
    instance.onVerify('foo');
    expect(wrapper.state().verified).toBe(true);
    expect(wrapper.state().recaptchaResponse).toBe('foo');
  });

  it('Should captcha hanlle expire', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    wrapper.setState({ verified: true });
    wrapper.setState({ recaptchaResponse: 'foo' });

    const instance = wrapper.instance();
    spyOn(instance, 'onExpired').and.callThrough();
    instance.onExpired();
    expect(wrapper.state().verified).toBe(false);
    expect(wrapper.state().recaptchaResponse).toBe('');
  });

  it('Should captcha can be cleared', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    wrapper.setState({ verified: true });
    wrapper.setState({ recaptchaResponse: 'foo' });

    const instance = wrapper.instance();
    spyOn(instance, 'clearCaptcha').and.callThrough();
    instance.clearCaptcha(false);
    expect(wrapper.state().verified).toBe(false);
    expect(wrapper.state().recaptchaResponse).toBe('');
  });

  it('Should captcha can be cleared with reset', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    wrapper.setState({ verified: true });
    wrapper.setState({ recaptchaResponse: 'foo' });

    const instance = wrapper.instance();
    const resetFn = jest.fn();
    instance.recaptchaRef = {
      current: {
        reset: resetFn
      }
    }
    spyOn(instance, 'clearCaptcha').and.callThrough();
    instance.clearCaptcha(true);
    expect(wrapper.state().verified).toBe(false);
    expect(wrapper.state().recaptchaResponse).toBe('');
    expect(resetFn).toHaveBeenCalled();
  });

  it('Should pending icon displayed when sending mail', () => {
    const wrapper = shallow(<Contact profileMain={profileMain} />);
    expect(wrapper.find('.btn-submit i')).toHaveLength(0);
    wrapper.setState({ pending: true });
    expect(wrapper.find('.btn-submit i')).toHaveLength(1);
  });
});
