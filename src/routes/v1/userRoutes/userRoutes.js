import { Router } from "express";
const router = Router();

import {
  loginSchema,
  passwordSchema,
  registerSchema,
} from "../../../schemas/user.schemas.js";
import { validateRequest } from "../../../utils/zodValidator.js";
import {
  changePasswordController,
  createUserController,
  deleteUserController,
  getAllUsersController,
  loginUserController,
  logoutController,
  updateUserProfileController,
  userProfileController,
} from "../../../controllers/user.controller.js";
import { authUser, } from "../../../middleware/authMiddleware.js";

router.post("/register", validateRequest(registerSchema), createUserController);
router.post("/login", validateRequest(loginSchema), loginUserController);
router.get("/profile", authUser, userProfileController);
router.put("/update", authUser, updateUserProfileController);
router.put(
  "/change-password",
  validateRequest(passwordSchema),
  authUser,
  changePasswordController
);
router.post("/logout", authUser, logoutController);

router.get('/all', authUser, getAllUsersController);
router.delete("/delete/:id",  authUser, deleteUserController);

export default router;
