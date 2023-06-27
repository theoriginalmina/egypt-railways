import { Router } from "express";
import UserController from "../controllers/user.controller";
import { container } from "tsyringe";
import validate from "../middlewares/validate";
import registerSchema from "../schemas/auth/registerSchema";
import loginSchema from "../schemas/auth/loginSchema";

const router = Router();

const userController = container.resolve(UserController);

router.post("/register", validate(registerSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);

export default router;
