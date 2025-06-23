import express from "express";
import { fetchRoboContestStats } from "../services/robocontestService.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const extension_type = req.query.extension_type || "card";
    const theme = req.query.theme || "dark";
    const {stats, activity} = await fetchRoboContestStats(username);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    switch (extension_type) {
      case "card_activity":
        res.render("robocontest/card-activity", { stats, activity, username, theme });
        break;
      case "card_attempts":
        res.render("robocontest/card-attempts", { stats, activity, username, theme });
        break;
      default:
        res.render("robocontest/card", { stats, activity, username, theme });
        break;
    }
  } catch (error) {
    console.error('Error generating RoboContest card:', error);
    res.status(500).send('Error generating card');
  }
});

export default router;