import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ReviewController } from "../controllers/review.controller.js";
import { ReviewService } from "../services/review.service.js";
import { ReviewRepository } from "../repositories/review.repository.js";

const router = express.Router();
const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);

const reviewController = new ReviewController(reviewService); // PostsController를 인스턴스화 시키니다.

export default router;
