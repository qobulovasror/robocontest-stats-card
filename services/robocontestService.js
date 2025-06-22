import axios from 'axios';
import { load } from 'cheerio';

const ROBOCONTEST_BASE_URL = 'https://robocontest.uz';

const fetchRoboContestStats = async (username) => {
  try {
    const profileUrl = `${ROBOCONTEST_BASE_URL}/profile/${username}`;
    const activityUrl = `${profileUrl}/attempts`;

    const response = await axios.get(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const activityResponse = await axios.get(activityUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (response.status !== 200 || activityResponse.status !== 200) {
      throw new Error('Failed to fetch RoboContest stats');
    }

    const $ = load(response.data);
    const $activity = load(activityResponse.data);

    // Extract user information
    const fullName = $('.card-title').first().children('b').text().trim();
    const usernameText = $('.card-title')
      .first()
      .children('small')
      .text()
      .trim();

    // Extract rank and rating
    const rankText = $('h4')
      .filter((i, el) => $(el).text().includes('Robo Rank'))
      .parent()
      .children('h1')
      .text()
      .trim();
    const ratingText = $('h4')
      .filter((i, el) => $(el).text().includes('Robo Rating'))
      .parent()
      .children('h1')
      .text()
      .trim();

    // Extract solved problems
    const solvedProblemsText = $('p')
      .filter((i, el) => $(el).text().includes('Yechgan masalalari'))
      .parent()
      .children('h3')
      .text()
      .trim();
    const [solved, total] = solvedProblemsText
      .split('/')
      .map((s) => parseInt(s.trim()));

    const stars = $('i.fa.fa-star').parent().text().trim();
    const [solvedStars, totalStars] = stars
      .split('/')
      .map((s) => parseInt(s.trim()));

    // Extract programming language stats
    const languageStats = {};
    $('table tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const langName = $(cells[1]).text().trim();
        const stats = $(cells[2]).text().trim().split(/\s+/);
        if (stats.length >= 3) {
          languageStats[langName] = {
            solved: parseInt(stats[0]) || 0,
            attempted: parseInt(stats[1]) || 0,
            submissions: parseInt(stats[2]) || 0,
          };
        }
      }
    });

    // Calculate totals
    const totalSolved = Object.values(languageStats).reduce(
      (sum, lang) => sum + lang.solved,
      0
    );
    const totalAttempted = Object.values(languageStats).reduce(
      (sum, lang) => sum + lang.attempted,
      0
    );
    const totalSubmissions = Object.values(languageStats).reduce(
      (sum, lang) => sum + lang.submissions,
      0
    );

    // Extract rank number
    const rankMatch = rankText.match(/(\d+)/);
    const rank = rankMatch ? parseInt(rankMatch[1]) : 0;

    // Extract rating
    const ratingMatch = ratingText.match(/(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    // Extract max rating
    const maxRatingMatch = ratingText.match(/max\.\s*(\d+)/);
    const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : 1500;

    // Extract join date
    const joinDateText = $('h6')
      .filter((i, el) => $(el).text().includes('dan beri'))
      .text()
      .trim();
    const joinDateMatch = joinDateText.match(/(\d{2}\.\d{2}\.\d{4})/);
    const joinDate = joinDateMatch ? joinDateMatch[1] : 'Unknown';

    // Get top languages by solved problems
    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b.solved - a.solved)
      .slice(0, 3)
      .map(([lang, stats]) => ({ language: lang, ...stats }));

    const activity = $activity('table tr')
      .slice(1, 6)
      .map((i, row) => {
        const cells = $activity(row).find('td');

        const rowId = $activity(cells[0]).text().trim();
        const taskName = $activity(cells[3]).text().trim();
        const langName = $activity(cells[4]).text().trim();
        const attemStatus = $activity(cells[5]).text().trim();
        const time = $activity(cells[6]).text().trim();
        const memory = $activity(cells[7]).text().trim();
        const date = $activity(cells[8]).text().trim();
        return {
          rowId,
          taskName,
          langName,
          attemStatus,
          time,
          memory,
          date,
        };
      })
      .get();

    const stats = {
      username: usernameText,
      fullName: fullName,
      rank,
      rating,
      maxRating,
      solvedStars,
      totalStars,
      solved,
      total,
      totalSolved,
      totalAttempted,
      totalSubmissions,
      joinDate,
      languageStats,
      topLanguages,
      successRate:
        totalAttempted > 0
          ? Math.round((totalSolved / totalAttempted) * 100)
          : 0,
    };

    return { stats, activity };
  } catch (error) {
    console.error('Error fetching RoboContest stats:', error);
    throw new Error(`Failed to fetch RoboContest stats for ${username}`);
  }
};

export { fetchRoboContestStats };
