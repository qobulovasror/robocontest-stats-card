import { describe, it, expect, vi } from 'vitest';
import { CustomErrorMiddleware, errorMiddleware } from '../../middlewares/customError.js';

describe('CustomErrorMiddleware', () => {
  it('res.locals.error ga CustomError qo\'yishi kerak', () => {
    const req = {};
    const res = { locals: {} };
    const next = vi.fn();

    CustomErrorMiddleware(req, res, next);

    expect(res.locals.error).toBeDefined();
    expect(res.locals.error.code).toBe(500);
    expect(res.locals.error.message).toBe('Internal Server Error');
  });

  it('next() ni chaqirishi kerak', () => {
    const req = {};
    const res = { locals: {} };
    const next = vi.fn();

    CustomErrorMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});

describe('errorMiddleware', () => {
  it('err dan status va message ni qaytarishi kerak', () => {
    const err = { status: 404, code: 404, message: 'Not Found' };
    const req = {};
    const json = vi.fn();
    const res = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ code: 404, message: 'Not Found' });
  });

  it('status bo\'lmasa 500 qaytarishi kerak', () => {
    const err = {};
    const req = {};
    const json = vi.fn();
    const res = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ code: 500, message: 'Internal Server Error' });
  });

  it('faqat message berilsa, code 500 bo\'lishi kerak', () => {
    const err = { status: 403, message: 'Forbidden' };
    const req = {};
    const json = vi.fn();
    const res = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ code: 500, message: 'Forbidden' });
  });
});
