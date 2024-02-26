import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { PetSittersController } from "../controllers/petsitters.controller.js";
import { PetSittersService } from "../services/petsitters.service.js";
import { PetSittersRepository } from "../repositories/petsitters.repository.js";

const router = express.Router();
const petSittersRepository = new PetSittersRepository(prisma);
const petSittersService = new PetSittersService(petSittersRepository);

const petSittersController = new PetSittersController(petSittersService); // PostsController를 인스턴스화 시키니다.

router.get("/sitters/search", petSittersController.getSitters);

router.get("/sitters", petSittersController.getSittersInfo);

export default router;
