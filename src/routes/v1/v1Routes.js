import { Router } from "express";
import userRoutes from "./userRoutes/userRoutes.js"
import galleryRoutes from "./galleryRoutes/galleryRoutes.js"
const router = Router();
router.use("/users", userRoutes);
router.use("/gallery", galleryRoutes);
export default router;
