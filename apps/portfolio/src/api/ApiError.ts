export class ApiError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
