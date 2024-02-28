import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";

const router = express.Router();

const usersRepository = new AuthRepository(prisma);
const usersService = new AuthService(usersRepository);
const authController = new AuthController(usersService); // PostsController를 인스턴스화 시키니다.

//토큰 발급
router.post("/token", authController.refreshToken);
