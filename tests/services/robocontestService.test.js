import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchRoboContestStats } from '../../services/robocontestService.js';

vi.mock('axios');

const mockProfileHTML = `
<html>
<body>
  <div class="card-title"><b>Asror Qobulov</b><small>asror</small></div>
  <div>
    <h4>Robo Rank</h4>
    <h1>42</h1>
  </div>
  <div>
    <h4>Robo Rating</h4>
    <h1>1850 (max. 1900)</h1>
  </div>
  <div>
    <p>Yechgan masalalari</p>
    <h3>120/500</h3>
  </div>
  <div>
    <i class="fa fa-star"></i> 45/100
  </div>
  <h6>01.01.2023 dan beri</h6>
  <table>
    <tr><th>#</th><th>Til</th><th>Stats</th></tr>
    <tr><td>1</td><td>C++</td><td>80 100 200</td></tr>
    <tr><td>2</td><td>Python</td><td>30 50 80</td></tr>
    <tr><td>3</td><td>Java</td><td>10 20 30</td></tr>
  </table>
</body>
</html>
`;

const mockActivityHTML = `
<html>
<body>
  <table>
    <tr><th>#</th><th>a</th><th>b</th><th>Task</th><th>Lang</th><th>Status</th><th>Time</th><th>Memory</th><th>Date</th></tr>
    <tr><td>1001</td><td>x</td><td>y</td><td>A+B</td><td>C++</td><td>Accepted</td><td>15ms</td><td>256KB</td><td>01.05.2024</td></tr>
    <tr><td>1002</td><td>x</td><td>y</td><td>Sum</td><td>Python</td><td>Wrong Answer</td><td>20ms</td><td>512KB</td><td>02.05.2024</td></tr>
  </table>
</body>
</html>
`;

describe('fetchRoboContestStats', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('foydalanuvchi statistikasini to\'g\'ri qaytarishi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats, activity } = await fetchRoboContestStats('asror');

    expect(stats.fullName).toBe('Asror Qobulov');
    expect(stats.username).toBe('asror');
    expect(stats.rank).toBe(42);
    expect(stats.rating).toBe(1850);
    expect(stats.maxRating).toBe(1900);
    expect(stats.solved).toBe(120);
    expect(stats.total).toBe(500);
    expect(stats.joinDate).toBe('01.01.2023');
  });

  it('til statistikasini to\'g\'ri hisoblashi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats } = await fetchRoboContestStats('asror');

    expect(stats.languageStats['C++']).toEqual({ solved: 80, attempted: 100, submissions: 200 });
    expect(stats.languageStats['Python']).toEqual({ solved: 30, attempted: 50, submissions: 80 });
    expect(stats.languageStats['Java']).toEqual({ solved: 10, attempted: 20, submissions: 30 });
  });

  it('totalSolved, totalAttempted, totalSubmissions ni to\'g\'ri hisoblashi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats } = await fetchRoboContestStats('asror');

    expect(stats.totalSolved).toBe(120); // 80+30+10
    expect(stats.totalAttempted).toBe(170); // 100+50+20
    expect(stats.totalSubmissions).toBe(310); // 200+80+30
  });

  it('successRate ni to\'g\'ri hisoblashi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats } = await fetchRoboContestStats('asror');

    // 120/170 * 100 = 70.58... => 71
    expect(stats.successRate).toBe(71);
  });

  it('topLanguages ni solved bo\'yicha saralashi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats } = await fetchRoboContestStats('asror');

    expect(stats.topLanguages).toHaveLength(3);
    expect(stats.topLanguages[0].language).toBe('C++');
    expect(stats.topLanguages[1].language).toBe('Python');
    expect(stats.topLanguages[2].language).toBe('Java');
  });

  it('activity ma\'lumotlarini to\'g\'ri qaytarishi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { activity } = await fetchRoboContestStats('asror');

    expect(activity).toHaveLength(2);
    expect(activity[0].taskName).toBe('A+B');
    expect(activity[0].langName).toBe('C++');
    expect(activity[0].attemStatus).toBe('Accepted');
    expect(activity[1].taskName).toBe('Sum');
    expect(activity[1].attemStatus).toBe('Wrong Answer');
  });

  it('API xatoligida xatolik berishi kerak', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    await expect(fetchRoboContestStats('asror')).rejects.toThrow(
      'Failed to fetch RoboContest stats for asror'
    );
  });

  it('status 200 bo\'lmasa xatolik berishi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 404, data: '' })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    await expect(fetchRoboContestStats('nonexistent')).rejects.toThrow(
      'Failed to fetch RoboContest stats for nonexistent'
    );
  });

  it('stars ma\'lumotlarini to\'g\'ri qaytarishi kerak', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockProfileHTML })
      .mockResolvedValueOnce({ status: 200, data: mockActivityHTML });

    const { stats } = await fetchRoboContestStats('asror');

    expect(stats.solvedStars).toBe(45);
    expect(stats.totalStars).toBe(100);
  });
});
