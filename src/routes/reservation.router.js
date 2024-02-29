import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ReserveController } from '../controllers/reservation.controller.js';
import { ReserveService } from "../services/reservation.service.js";
import { ReserveRepository } from "../repositories/reservation.repository.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
// PostsController를 인스턴스화 시킨다

const reserveRepository = new ReserveRepository(prisma);
const reserveService = new ReserveService(reserveRepository);
const reserveController = new ReserveController(reserveService);

// 예약
router.post("/reserve",authMiddleware ,reserveController.createReserve);

// 예약 조회
router.get("/reserve", authMiddleware, reserveController.getdetailreserve);

// 예약 수정
router.put("/reserve", authMiddleware, reserveController.updateReserve);

// 예약 삭제
router.delete("/reserve", authMiddleware, reserveController.deleteReserve);

export default router;
