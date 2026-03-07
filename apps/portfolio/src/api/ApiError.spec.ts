import { ApiError } from './ApiError';

describe('ApiError', () => {
  it('should be an instance of Error', () => {
    const error = new ApiError('something went wrong', 500, { detail: 'oops' });
    expect(error).toBeInstanceOf(Error);
  });

  it('should set the message', () => {
    const error = new ApiError('something went wrong', 500, null);
    expect(error.message).toBe('something went wrong');
  });

  it('should set name to ApiError', () => {
    const error = new ApiError('msg', 400, null);
    expect(error.name).toBe('ApiError');
  });

  it('should set httpStatus', () => {
    const error = new ApiError('msg', 404, null);
    expect(error.httpStatus).toBe(404);
  });

  it('should set data', () => {
    const data = { field: 'email', issue: 'invalid' };
    const error = new ApiError('msg', 422, data);
    expect(error.data).toEqual(data);
  });
});
