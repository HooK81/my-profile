import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  SUBJECT_MAX_LENGTH,
} from 'my-profile-shared';

vi.mock('react-i18next');
vi.mock('../../../api/Api');

import api from '../../../api/Api';
import { renderWithQueryClient } from '../../../test-utils';
import ContactForm from './ContactForm';

const mockedApi = vi.mocked(api);

afterEach(() => cleanup());

function fillForm(
  overrides: Partial<{ from: string; subject: string; message: string }> = {},
) {
  const from = overrides.from ?? 'test@example.com';
  const subject = overrides.subject ?? 'Test Subject';
  const message =
    overrides.message ?? 'A valid test message for the form submission';

  fireEvent.change(
    screen.getByPlaceholderText('contact.form.emailPlaceholder'),
    { target: { value: from } },
  );

  if (subject) {
    fireEvent.change(
      screen.getByPlaceholderText('contact.form.subjectPlaceholder'),
      { target: { value: subject } },
    );
  }

  fireEvent.change(
    screen.getByPlaceholderText('contact.form.messagePlaceholder'),
    { target: { value: message } },
  );
}

function submitForm() {
  fireEvent.click(
    screen.getByRole('button', { name: 'contact.form.sendButton' }),
  );
}

describe('ContactForm', () => {
  describe('rendering', () => {
    it('should render an email input with required attribute', () => {
      renderWithQueryClient(<ContactForm />);

      const email = screen.getByPlaceholderText(
        'contact.form.emailPlaceholder',
      );
      expect(email).toHaveAttribute('type', 'email');
      expect(email).toHaveAttribute('name', 'from');
      expect(email).toBeRequired();
    });

    it('should render a subject input with maxLength constraint', () => {
      renderWithQueryClient(<ContactForm />);

      const subject = screen.getByPlaceholderText(
        'contact.form.subjectPlaceholder',
      );
      expect(subject).toHaveAttribute('type', 'text');
      expect(subject).toHaveAttribute('name', 'subject');
      expect(subject).toHaveAttribute('maxLength', String(SUBJECT_MAX_LENGTH));
    });

    it('should render a message textarea with required and length constraints', () => {
      renderWithQueryClient(<ContactForm />);

      const message = screen.getByPlaceholderText(
        'contact.form.messagePlaceholder',
      );
      expect(message).toHaveAttribute('name', 'message');
      expect(message).toBeRequired();
      expect(message).toHaveAttribute('minLength', String(MESSAGE_MIN_LENGTH));
      expect(message).toHaveAttribute('maxLength', String(MESSAGE_MAX_LENGTH));
    });

    it('should render a submit button', () => {
      renderWithQueryClient(<ContactForm />);

      const button = screen.getByRole('button', {
        name: 'contact.form.sendButton',
      });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should not display the character counter initially', () => {
      renderWithQueryClient(<ContactForm />);

      expect(
        screen.queryByText(new RegExp(`\\d+ / ${MESSAGE_MAX_LENGTH}`)),
      ).not.toBeInTheDocument();
    });
  });

  describe('character counter', () => {
    it('should display the counter when the user types in the message field', () => {
      renderWithQueryClient(<ContactForm />);

      fireEvent.change(
        screen.getByPlaceholderText('contact.form.messagePlaceholder'),
        { target: { value: 'Hello' } },
      );

      expect(screen.getByText(`5 / ${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument();
    });

    it('should hide the counter when message is cleared', () => {
      renderWithQueryClient(<ContactForm />);

      const textarea = screen.getByPlaceholderText(
        'contact.form.messagePlaceholder',
      );
      fireEvent.change(textarea, { target: { value: 'Hello' } });
      fireEvent.change(textarea, { target: { value: '' } });

      expect(
        screen.queryByText(new RegExp(`\\d+ / ${MESSAGE_MAX_LENGTH}`)),
      ).not.toBeInTheDocument();
    });

    it('should apply warning class when message reaches 90% of max length', () => {
      renderWithQueryClient(<ContactForm />);

      const warningLength = MESSAGE_MAX_LENGTH * 0.9;
      const text = 'x'.repeat(warningLength);

      fireEvent.change(
        screen.getByPlaceholderText('contact.form.messagePlaceholder'),
        { target: { value: text } },
      );

      const counter = screen.getByText(
        `${warningLength} / ${MESSAGE_MAX_LENGTH}`,
      );
      expect(counter).toHaveClass('charCounterWarning');
    });
  });

  describe('submission', () => {
    it('should mark the submit button busy and show the sending status while submitting', async () => {
      let resolveSubmit!: () => void;
      mockedApi.sendMail.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          }),
      );

      renderWithQueryClient(<ContactForm />);
      fillForm();
      submitForm();

      expect(await screen.findByRole('status')).toHaveTextContent(
        'contact.form.sending',
      );
      const button = screen.getByRole('button', {
        name: 'contact.form.sendButton',
      });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).not.toBeDisabled();

      resolveSubmit();

      await waitFor(() => {
        expect(button).not.toHaveAttribute('aria-busy');
      });
    });
  });

  describe('successful submission', () => {
    beforeEach(() => {
      mockedApi.sendMail.mockResolvedValue(undefined);
    });

    it('should call api.sendMail with correct payload', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm();
      submitForm();

      await waitFor(() => {
        expect(mockedApi.sendMail).toHaveBeenCalledWith({
          from: 'test@example.com',
          message: 'A valid test message for the form submission',
          subject: 'Test Subject',
        });
      });
    });

    it('should show the success status next to the button', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm();
      submitForm();

      expect(
        await screen.findByText('contact.form.sendSuccess'),
      ).toHaveAttribute('role', 'status');
    });

    it('should clear the status once the user types a new message', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm();
      submitForm();
      await screen.findByText('contact.form.sendSuccess');

      fireEvent.change(
        screen.getByPlaceholderText('contact.form.messagePlaceholder'),
        { target: { value: 'Hello' } },
      );

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(`5 / ${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument();
    });

    it('should reset the character counter after successful send', async () => {
      renderWithQueryClient(<ContactForm />);

      fireEvent.change(
        screen.getByPlaceholderText('contact.form.messagePlaceholder'),
        { target: { value: 'A valid test message for the form submission' } },
      );
      expect(
        screen.getByText(new RegExp(`\\d+ / ${MESSAGE_MAX_LENGTH}`)),
      ).toBeInTheDocument();

      fillForm();
      submitForm();

      await waitFor(() => {
        expect(
          screen.queryByText(new RegExp(`\\d+ / ${MESSAGE_MAX_LENGTH}`)),
        ).not.toBeInTheDocument();
      });
    });

    it('should send subject as undefined when subject is empty', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm({ subject: '' });
      submitForm();

      await waitFor(() => {
        expect(mockedApi.sendMail).toHaveBeenCalledWith({
          from: 'test@example.com',
          message: 'A valid test message for the form submission',
          subject: undefined,
        });
      });
    });
  });

  describe('failed submission', () => {
    beforeEach(() => {
      mockedApi.sendMail.mockRejectedValue(new Error('Network error'));
    });

    it('should show the error status next to the button', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm();
      submitForm();

      expect(
        await screen.findByText('contact.form.sendError error.tryAgainLater'),
      ).toHaveAttribute('role', 'status');
    });

    it('should preserve form values when sending fails', async () => {
      renderWithQueryClient(<ContactForm />);
      fillForm({
        from: 'user@test.com',
        subject: 'My Subject',
        message: 'This is a message that should be preserved',
      });
      submitForm();

      await screen.findByText('contact.form.sendError error.tryAgainLater');

      expect(
        screen.getByPlaceholderText('contact.form.emailPlaceholder'),
      ).toHaveValue('user@test.com');
      expect(
        screen.getByPlaceholderText('contact.form.subjectPlaceholder'),
      ).toHaveValue('My Subject');
      expect(
        screen.getByPlaceholderText('contact.form.messagePlaceholder'),
      ).toHaveValue('This is a message that should be preserved');
    });
  });
});
