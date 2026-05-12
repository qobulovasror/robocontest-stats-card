import { describe, it, expect } from 'vitest';

// Handlebars helpers ni startup/routes.js dan olib, alohida test qilamiz
const helpers = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  and: (...args) => args.slice(0, -1).every(Boolean),
  add: (a, b) => Number(a) + Number(b),
  multiply: (a, b) => Number(a) * Number(b),
  isEven: (n) => Number(n) % 2 === 0,
  formatNumber: (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toLocaleString('en-US') : '';
  },
  progressWidth: (value, maxValue, width) => {
    const v = Number(value);
    const m = Number(maxValue);
    const w = Number(width);
    if (!Number.isFinite(v) || !Number.isFinite(m) || !Number.isFinite(w) || m === 0) return 0;
    const computed = (v / m) * w;
    return Math.max(0, Math.min(w, Math.round(computed)));
  },
  truncate: (str, max) => {
    const s = String(str ?? '');
    const m = Number(max) || 0;
    return s.length > m ? `${s.substring(0, m)}...` : s;
  },
  isAccepted: (status) => String(status ?? '').toLowerCase().includes('accepted'),
  ternary: (cond, a, b) => (cond ? a : b),
};

describe('Handlebars Helpers', () => {
  describe('eq', () => {
    it('teng qiymatlar uchun true qaytarishi kerak', () => {
      expect(helpers.eq(1, 1)).toBe(true);
      expect(helpers.eq('a', 'a')).toBe(true);
    });

    it('teng bo\'lmagan qiymatlar uchun false qaytarishi kerak', () => {
      expect(helpers.eq(1, 2)).toBe(false);
      expect(helpers.eq(1, '1')).toBe(false); // strict equality
    });
  });

  describe('neq', () => {
    it('teng bo\'lmagan qiymatlar uchun true qaytarishi kerak', () => {
      expect(helpers.neq(1, 2)).toBe(true);
    });

    it('teng qiymatlar uchun false qaytarishi kerak', () => {
      expect(helpers.neq(1, 1)).toBe(false);
    });
  });

  describe('and', () => {
    it('barcha true bo\'lsa true qaytarishi kerak', () => {
      expect(helpers.and(true, true, {})).toBe(true);
    });

    it('birontasi false bo\'lsa false qaytarishi kerak', () => {
      expect(helpers.and(true, false, {})).toBe(false);
    });

    it('bitta argument bilan ishlashi kerak', () => {
      expect(helpers.and(true, {})).toBe(true);
      expect(helpers.and(false, {})).toBe(false);
    });
  });

  describe('add', () => {
    it('ikki sonni qo\'shishi kerak', () => {
      expect(helpers.add(2, 3)).toBe(5);
    });

    it('string sonlarni qo\'shishi kerak', () => {
      expect(helpers.add('10', '20')).toBe(30);
    });
  });

  describe('multiply', () => {
    it('ikki sonni ko\'paytirishi kerak', () => {
      expect(helpers.multiply(3, 4)).toBe(12);
    });

    it('string sonlarni ko\'paytirishi kerak', () => {
      expect(helpers.multiply('5', '6')).toBe(30);
    });
  });

  describe('isEven', () => {
    it('juft son uchun true qaytarishi kerak', () => {
      expect(helpers.isEven(2)).toBe(true);
      expect(helpers.isEven(0)).toBe(true);
    });

    it('toq son uchun false qaytarishi kerak', () => {
      expect(helpers.isEven(1)).toBe(false);
      expect(helpers.isEven(3)).toBe(false);
    });
  });

  describe('formatNumber', () => {
    it('sonni formatlashi kerak', () => {
      expect(helpers.formatNumber(1000)).toBe('1,000');
      expect(helpers.formatNumber(1234567)).toBe('1,234,567');
    });

    it('son bo\'lmasa bo\'sh string qaytarishi kerak', () => {
      expect(helpers.formatNumber('abc')).toBe('');
      expect(helpers.formatNumber(undefined)).toBe('');
    });

    it('0 ni formatlashi kerak', () => {
      expect(helpers.formatNumber(0)).toBe('0');
    });
  });

  describe('progressWidth', () => {
    it('progress kengligini to\'g\'ri hisoblashi kerak', () => {
      expect(helpers.progressWidth(50, 100, 200)).toBe(100);
      expect(helpers.progressWidth(25, 100, 200)).toBe(50);
    });

    it('maxValue 0 bo\'lsa 0 qaytarishi kerak', () => {
      expect(helpers.progressWidth(50, 0, 200)).toBe(0);
    });

    it('width dan katta bo\'lmasligi kerak', () => {
      expect(helpers.progressWidth(150, 100, 200)).toBe(200);
    });

    it('0 dan kichik bo\'lmasligi kerak', () => {
      expect(helpers.progressWidth(-10, 100, 200)).toBe(0);
    });

    it('NaN qiymatlar uchun 0 qaytarishi kerak', () => {
      expect(helpers.progressWidth('abc', 100, 200)).toBe(0);
    });
  });

  describe('truncate', () => {
    it('uzun stringni qisqartirishi kerak', () => {
      expect(helpers.truncate('Hello World', 5)).toBe('Hello...');
    });

    it('qisqa stringni o\'zgartirmasligi kerak', () => {
      expect(helpers.truncate('Hi', 5)).toBe('Hi');
    });

    it('null/undefined bilan ishlashi kerak', () => {
      expect(helpers.truncate(null, 5)).toBe('');
      expect(helpers.truncate(undefined, 5)).toBe('');
    });
  });

  describe('isAccepted', () => {
    it('"Accepted" uchun true qaytarishi kerak', () => {
      expect(helpers.isAccepted('Accepted')).toBe(true);
      expect(helpers.isAccepted('ACCEPTED')).toBe(true);
      expect(helpers.isAccepted('accepted')).toBe(true);
    });

    it('boshqa statuslar uchun false qaytarishi kerak', () => {
      expect(helpers.isAccepted('Wrong Answer')).toBe(false);
      expect(helpers.isAccepted('TLE')).toBe(false);
    });

    it('null/undefined bilan ishlashi kerak', () => {
      expect(helpers.isAccepted(null)).toBe(false);
      expect(helpers.isAccepted(undefined)).toBe(false);
    });
  });

  describe('ternary', () => {
    it('true bo\'lsa birinchi qiymatni qaytarishi kerak', () => {
      expect(helpers.ternary(true, 'yes', 'no')).toBe('yes');
    });

    it('false bo\'lsa ikkinchi qiymatni qaytarishi kerak', () => {
      expect(helpers.ternary(false, 'yes', 'no')).toBe('no');
    });
  });
});
