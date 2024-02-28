import express from "express";
//import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
// import s3Middleware from "../middlewares/s3.middleware.js";
import ProfileController from "../controllers/profile.controller.js";

const router = express.Router();

const profileController = new ProfileController();

router.get("/users/me", authMiddleware, profileController.getProfileById);
router.update("/users/me-updates", profileController.updateProfile);

export default router;
