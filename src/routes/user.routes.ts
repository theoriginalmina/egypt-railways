import { Router } from "express";
import { container } from "tsyringe";
import UserController from "../controllers/user.controller";
import validate from "../middlewares/validate";
import loginSchema from "../schemas/auth/loginSchema";
import registerSchema from "../schemas/auth/registerSchema";

const router = Router();

const userController = container.resolve(UserController);

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

export default router;
