import { Router } from "express";
import { authUser } from "../../../middleware/authMiddleware.js";
import {
  handleUploadErrors,
  upload,
} from "../../../middleware/multerConfig.js";
import { galleryController } from "../../../controllers/gallery.controller.js";

const router = Router();
router.post(
  "/",authUser,
  upload.array("files", 6),
  galleryController.uploadGalleryFiles
);

router.put(
  "/:id",authUser,
  upload.array("files", 6),
  galleryController.editGalleryFiles
);

router.get("/:id", galleryController.getGalleryFiles);

router.delete("/:id", authUser, galleryController.deleteGalleryFiles);

router.get("/",galleryController.getAllGalleryFiles);

router.use(handleUploadErrors);

export default router;
