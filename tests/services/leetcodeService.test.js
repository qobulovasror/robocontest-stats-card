import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchLeetCodeStats } from '../../services/leetcodeService.js';

vi.mock('axios');

const mockLeetCodeResponse = (overrides = {}) => ({
  data: {
    data: {
      matchedUser: {
        username: 'testuser',
        profile: {
          ranking: 50000,
          realName: 'Test User',
          countryName: 'Uzbekistan',
          starRating: 3.5,
          aboutMe: 'Hello',
          userAvatar: 'https://example.com/avatar.png',
          reputation: 100,
          postViewCount: 500,
          postViewCountDiff: 10,
          solutionCount: 5,
          solutionCountDiff: 1,
          categoryDiscussCount: 3,
          categoryDiscussCountDiff: 0,
        },
        submitStats: {
          acSubmissionNum: [
            { difficulty: 'All', count: 150, submissions: 200 },
            { difficulty: 'Easy', count: 80, submissions: 90 },
            { difficulty: 'Medium', count: 50, submissions: 70 },
            { difficulty: 'Hard', count: 20, submissions: 40 },
          ],
          totalSubmissionNum: [
            { difficulty: 'All', count: 400, submissions: 400 },
            { difficulty: 'Easy', count: 150, submissions: 150 },
            { difficulty: 'Medium', count: 150, submissions: 150 },
            { difficulty: 'Hard', count: 100, submissions: 100 },
          ],
        },
        badges: [{ id: '1', displayName: 'Badge1', icon: 'icon.png', category: 'cat' }],
        upcomingBadges: [],
        activeBadge: { id: '1', displayName: 'Badge1', icon: 'icon.png', category: 'cat' },
        ...overrides,
      },
    },
  },
});

describe('fetchLeetCodeStats', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('foydalanuvchi statistikasini to\'g\'ri qaytarishi kerak', async () => {
    axios.post.mockResolvedValue(mockLeetCodeResponse());

    const result = await fetchLeetCodeStats('testuser');

    expect(result.username).toBe('testuser');
    expect(result.realName).toBe('Test User');
    expect(result.ranking).toBe(50000);
    expect(result.easySolved).toBe(80);
    expect(result.mediumSolved).toBe(50);
    expect(result.hardSolved).toBe(20);
    expect(result.country).toBe('Uzbekistan');
    expect(result.badges).toHaveLength(1);
    expect(result.activeBadge).toBeDefined();
  });

  it('totalSolved ni to\'g\'ri hisoblashi kerak', async () => {
    axios.post.mockResolvedValue(mockLeetCodeResponse());

    const result = await fetchLeetCodeStats('testuser');

    // 150 (All) + 80 (Easy) + 50 (Medium) + 20 (Hard) = 300
    expect(result.totalSolved).toBe(300);
  });

  it('acceptanceRate ni to\'g\'ri hisoblashi kerak', async () => {
    axios.post.mockResolvedValue(mockLeetCodeResponse());

    const result = await fetchLeetCodeStats('testuser');

    // totalSolved=300, totalSubmissions=800 => 300/800*100 = 37.5 => 38 (rounded)
    expect(result.acceptanceRate).toBe(38);
  });

  it('foydalanuvchi topilmasa xatolik berishi kerak', async () => {
    axios.post.mockResolvedValue({
      data: { data: { matchedUser: null } },
    });

    await expect(fetchLeetCodeStats('nonexistent')).rejects.toThrow(
      'Failed to fetch LeetCode stats for nonexistent'
    );
  });

  it('API xatoligida xatolik berishi kerak', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));

    await expect(fetchLeetCodeStats('testuser')).rejects.toThrow(
      'Failed to fetch LeetCode stats for testuser'
    );
  });

  it('profile ma\'lumotlari bo\'lmasa default qiymatlar qaytarishi kerak', async () => {
    const response = mockLeetCodeResponse();
    response.data.data.matchedUser.profile = {
      ranking: null,
      realName: null,
      countryName: null,
      starRating: null,
      userAvatar: null,
      reputation: null,
    };
    axios.post.mockResolvedValue(response);

    const result = await fetchLeetCodeStats('testuser');

    expect(result.realName).toBe('testuser');
    expect(result.ranking).toBe(0);
    expect(result.reputation).toBe(0);
    expect(result.starRating).toBe(0);
    expect(result.country).toBe('Unknown');
    expect(result.avatar).toBeNull();
  });

  it('submission bo\'lmasa acceptanceRate 0 bo\'lishi kerak', async () => {
    const response = mockLeetCodeResponse();
    response.data.data.matchedUser.submitStats = {
      acSubmissionNum: [{ difficulty: 'All', count: 0, submissions: 0 }],
      totalSubmissionNum: [{ difficulty: 'All', count: 0, submissions: 0 }],
    };
    axios.post.mockResolvedValue(response);

    const result = await fetchLeetCodeStats('testuser');

    expect(result.acceptanceRate).toBe(0);
    expect(result.totalSolved).toBe(0);
  });

  it('Easy/Medium/Hard topilmasa 0 qaytarishi kerak', async () => {
    const response = mockLeetCodeResponse();
    response.data.data.matchedUser.submitStats = {
      acSubmissionNum: [{ difficulty: 'All', count: 0, submissions: 0 }],
      totalSubmissionNum: [{ difficulty: 'All', count: 0, submissions: 0 }],
    };
    axios.post.mockResolvedValue(response);

    const result = await fetchLeetCodeStats('testuser');

    expect(result.easySolved).toBe(0);
    expect(result.mediumSolved).toBe(0);
    expect(result.hardSolved).toBe(0);
  });
});
