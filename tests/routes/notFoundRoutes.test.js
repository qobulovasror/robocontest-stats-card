import { describe, it, expect, vi } from 'vitest';
import NotFoundRoutes from '../../routes/notFoundRoutes.js';

describe('NotFoundRoutes', () => {
  it('404 status va "Not Found" qaytarishi kerak', () => {
    const req = {};
    const send = vi.fn();
    const res = { status: vi.fn(() => ({ send })) };
    const next = vi.fn();

    NotFoundRoutes(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith('Not Found');
  });
});
