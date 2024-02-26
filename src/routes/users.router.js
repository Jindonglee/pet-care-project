import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";

const router = express.Router();
const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService); // PostsController를 인스턴스화 시키니다.

//회원가입
router.post("/sign-up", usersController.createUser);

//로그인
router.post("/sign-in", usersController.signinUser);

//로그아웃
router.post("/sign-out", usersController.signoutUser);

//계정탈퇴
router.post("/delete-account", usersController.deleteUser);

export default router;
