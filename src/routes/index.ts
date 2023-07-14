import { Router } from "express";
import userRoutes from "./user.routes";
import tripRoutes from "./trip.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/trips", tripRoutes);

export default router;
