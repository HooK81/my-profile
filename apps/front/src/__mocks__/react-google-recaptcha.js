import React, { useEffect, useRef } from 'react';
const originalModule = jest.requireActual('react-google-recaptcha');

const mockReset = jest.fn();

const MockReCAPTCHA = React.forwardRef((props, ref) => {
  ref.current = {reset: mockReset};
  const timeoutRef = useRef(null);
  const onChange = () => {
    props.onChange('fake_captcha_response');
    timeoutRef.current = setTimeout(() => {
      props.onExpired();
    }, 4000);
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return <input type="checkbox" ref={ref} className={props.size} onChange={onChange} data-testid="recaptcha-sign-in" />;
});

module.exports = {
  __esModule: true,
  ...originalModule,
  default: MockReCAPTCHA,
  mockReset: mockReset,
}
