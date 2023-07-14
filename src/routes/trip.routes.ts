import { Router } from "express";
import TripController from "../controllers/trip.controller";
import { container } from "tsyringe";
import { validateQuery, validateBody } from "../middlewares/validate";
import addTripSchema from "../schemas/trip/addTripSchema";
import searchSchema from "../schemas/trip/searchSchema";

const router = Router();

const tripController = container.resolve(TripController);

router.post("/", validateBody(addTripSchema), tripController.addTrip);
router.get("/", validateQuery(searchSchema), tripController.search);

export default router;
