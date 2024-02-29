import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
// import { uploadImage } from "../middlewares/s3.middleware.js";
import { ProfileController } from "../controllers/profile.controller.js";
import { ProfileService } from "../services/profile.service.js";
import { ProfileRepository } from "../repositories/profile.repository.js";

const router = express.Router();

const profileRepository = new ProfileRepository(prisma);
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

/* 프로필 조회 */
router.get("/users/me", authMiddleware, profileController.getProfile);

/* 프로필 수정 */
router.put(
  "/users/me-updates",
  authMiddleware,
  profileController.updateProfile
);

export default router;
