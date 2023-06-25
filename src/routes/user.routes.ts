import { Router } from "express";
import UserController from "../controllers/user.controller";
import { container } from "tsyringe";
import validate from "../middlewares/validate";
import registerSchema from "../schemas/user/registerSchema";

const router = Router();

const userController = container.resolve(UserController);

router.post("/", validate(registerSchema), userController.createUser);

export default router;
