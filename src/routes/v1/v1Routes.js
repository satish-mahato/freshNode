import { Router } from "express";
import userRoutes from "./userRoutes/userRoutes.js"
import galleryRoutes from "./galleryRoutes/galleryRoutes.js"
import slideRoutes from "./slideRoutes/slideRoutes.js"
const router = Router();
router.use("/users", userRoutes);
router.use("/gallery", galleryRoutes);
router.use("/slide", slideRoutes);
export default router;
