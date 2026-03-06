import type { HttpStatusCode } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: HttpStatusCode,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
