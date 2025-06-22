import express from "express";
import { fetchLeetCodeStats } from "../services/leetcodeService.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await fetchLeetCodeStats(username);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    res.render("leetcode-card", { stats, username });
  } catch (error) {
    console.error('Error generating LeetCode card:', error);
    res.status(500).send('Error generating card');
  }
});

export default router; 