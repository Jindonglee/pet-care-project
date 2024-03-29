import express from "express";
import ReviewRouter from "./review.router.js";
import UsersRouter from "./users.router.js";
import PetsitterRouter from "./petsitters.router.js";
import ReservationRouter from "./reservation.router.js";
import ProfileRouter from "./profile.router.js";

const router = express.Router();

router.use("/", [
  ReviewRouter,
  UsersRouter,
  PetsitterRouter,
  ReservationRouter,
  ProfileRouter,
]);

export default router;
