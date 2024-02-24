import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ReservationController } from "../controllers/reservation.controller.js";
import { ReservationService } from "../services/reservation.service.js";
import { ReservationRepository } from "../repositories/reservation.repository.js";

const router = express.Router();
const reservationRepository = new ReservationRepository(prisma);
const reservationService = new ReservationService(reservationRepository);

const reservationController = new ReservationController(reservationService); // PostsController를 인스턴스화 시키니다.

export default router;
