import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";
import isLoggedIn from "../middlewares/login.middleware.js";

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService); // PostsController를 인스턴스화 시키니다.

//회원가입
router.post("/user/sign-up", usersController.signup);

//로그인
router.post("/user/sign-in", isLoggedIn, usersController.signin);

//로그아웃
router.post("/user/sign-out", usersController.signout);

//계정탈퇴
router.delete("/user/delete/:userId", usersController.deleteUser);

export default router;
