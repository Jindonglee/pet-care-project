import express from "express";
import { prisma } from "../utils/prisma/index.js";
import auth  from "../middlewares/auth.middleware.js"
import { ReviewController } from "../controllers/review.controller.js";
import { ReviewService } from "../services/review.service.js";
import { ReviewRepository } from "../repositories/review.repository.js";

const router = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService); // PostsController를 인스턴스화 시키니다.

router.get('/review/:sitterId', reviewController.getReviews); 
router.post('/review/:sitterId', auth, reviewController.postReview);
router.patch('/review/:reviewId', auth, reviewController.patchReview);
router.delete('/review/:reviewId', auth, reviewController.deleteReview);

export default router;


//- **펫시터 리뷰 CRUD**
//- 펫시터 리뷰 제목, 지정,기간, 작성일자, 별점
//- (펫 시터일이 완료된 후에) 예약일이 지난 후 에 작성 가능하게
//- 이용한 해당 펫시터에게(예약정보) 바로 리뷰 작성 가능하게