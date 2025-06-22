import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const fetchLeetCodeStats = async (username) => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            realName
            countryName
            starRating
            aboutMe
            userAvatar
            reputation
            postViewCount
            postViewCountDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          badges {
            id
            displayName
            icon
            category
          }
          upcomingBadges {
            name
            icon
          }
          activeBadge {
            id
            displayName
            icon
            category
          }
        }
      }
    `;

    const response = await axios.post(LEETCODE_API_URL, {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = response.data.data;
    
    if (!data.matchedUser) {
      throw new Error('User not found');
    }

    const user = data.matchedUser;
    const profile = user.profile;
    const submitStats = user.submitStats;

    // Extract submission stats
    const acSubmissions = submitStats.acSubmissionNum;
    const totalSubmissions = submitStats.totalSubmissionNum;

    // Calculate totals
    const totalSolved = acSubmissions.reduce((sum, item) => sum + item.count, 0);
    const totalSubmissionsCount = totalSubmissions.reduce((sum, item) => sum + item.count, 0);

    // Get difficulty-wise stats
    const easySolved = acSubmissions.find(item => item.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acSubmissions.find(item => item.difficulty === 'Medium')?.count || 0;
    const hardSolved = acSubmissions.find(item => item.difficulty === 'Hard')?.count || 0;

    return {
      username: user.username,
      realName: profile.realName || user.username,
      ranking: profile.ranking || 0,
      reputation: profile.reputation || 0,
      totalSolved,
      totalSubmissions: totalSubmissionsCount,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate: totalSubmissionsCount > 0 ? Math.round((totalSolved / totalSubmissionsCount) * 100) : 0,
      starRating: profile.starRating || 0,
      country: profile.countryName || 'Unknown',
      avatar: profile.userAvatar || null,
      badges: user.badges || [],
      activeBadge: user.activeBadge || null
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    throw new Error(`Failed to fetch LeetCode stats for ${username}`);
  }
};

export { fetchLeetCodeStats }; 