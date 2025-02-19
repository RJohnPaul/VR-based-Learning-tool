import express, { Request, Response } from "express";
import authenticateUser, { AuthRequest } from "./middleware/authenticateUser";
import { Score } from "./models/ScoreSchema";

const router = express.Router();

router.post("/submit-score", authenticateUser, async (req: Request, res: Response): Promise<any> => {
  try {
    const { activity, score, email } = req.body;
    const userId = (req as AuthRequest).user?.userId;

    if (!activity || score === undefined || !email) {
      return res.status(400).json({ message: "Activity type, score, and email are required." });
    }

    if (!["communication-quiz", "object-quiz", "road-crossing"].includes(activity)) {
      return res.status(400).json({ message: "Invalid activity type." });
    }

    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({ message: "Invalid score value." });
    }

    let existingScore = await Score.findOne({ userId, email });

    if (existingScore) {
      // Ensure that score is a Map, and update it using the Map API
      if (!existingScore.score || !(existingScore.score instanceof Map)) {
        existingScore.score = new Map();
      }
      existingScore.score.set(activity, score);
      // No need to call markModified when using Map methods
      await existingScore.save();
    } else {
      existingScore = new Score({
        userId,
        email,
        score: new Map([[activity, score]]), // Initialize score as a Map with the activity score
      });
      await existingScore.save();
    }

    res.status(201).json({ message: "Score submitted successfully." });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/get-score", authenticateUser, async (req: Request, res: Response): Promise<any> => {
  try {
    // Retrieve email from the authenticated user instead of userId
    const email = (req as AuthRequest).user?.email;
    if (!email) {
      return res.status(400).json({ message: "Email not found in token." });
    }

    // Search for the score document using the email
    const scoreDoc = await Score.findOne({ email });
    if (!scoreDoc) {
      return res.status(404).json({ message: "No score found for this user." });
    }

    // Convert the score field to a plain object if necessary
    let score: { [activity: string]: number };
    if (scoreDoc.score instanceof Map) {
      score = Object.fromEntries(scoreDoc.score);
    } else {
      score = scoreDoc.score;
    }

    res.json({ score });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
