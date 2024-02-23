import express from "express";
import ReviewRouter from "./review.router.js";
import UsersRouter from "./users.router.js";
import PetsitterRouter from "./petsitter.router.js";
import ReservationRouter from "./reservation.router.js";

const router = express.Router();

router.use("/", [
  ReviewRouter,
  UsersRouter,
  PetsitterRouter,
  ReservationRouter,
]);

export default router;
