import { AppError } from './errors';

describe('AppError', () => {
  it('exposes a stable code and user-facing message', () => {
    const error = new AppError('not_found', 'Weather data could not be retrieved.');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('not_found');
    expect(error.userMessage).toBe('Weather data could not be retrieved.');
  });
});
