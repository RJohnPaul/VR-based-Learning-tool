import express, { Request, Response, NextFunction } from "express";
import Profile, { IProfile } from "./models/ProfileSchema";
import authenticateUser, { AuthRequest } from "./middleware/authenticateUser";

const router = express.Router();

interface ProfileRequestBody extends Partial<IProfile> {}

/**
 * @route   POST /profile
 * @desc    Create or update user profile
 * @access  Private (Requires Authentication)
 */
router.post(
  "/profile",
  authenticateUser,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { name, age, gender, disorder, mobile, avatar } = req.body;
      const email = authReq.user?.email;

      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }

      const profile = await Profile.findOneAndUpdate(
        { email },
        { name, age, gender, disorder, mobile, avatar },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ message: "Profile saved successfully", profile });
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

/**
 * @route   GET /profile
 * @desc    Fetch user profile
 * @access  Private (Requires Authentication)
 */
router.get(
  "/profile",
  authenticateUser,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const email = authReq.user?.email;

      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }

      const profile = await Profile.findOne({ email });

      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }

      res.status(200).json({ profile });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
