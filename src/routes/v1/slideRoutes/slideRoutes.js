import { Router } from "express";
import {
  handleUploadErrors,
  upload,
} from "../../../middleware/multerConfig.js";
import imageController from "../../../controllers/image.controller.js";
import { authUser } from "../../../middleware/authMiddleware.js";
const router = Router();

router.post(
  "/",
  authUser,
  upload.single("image"),
  handleUploadErrors,
  imageController.uploadImage
);

router.get("/", imageController.getAllImages);
router.get("/:id", authUser, imageController.getImageById);
router.put(
  "/:id",
  authUser,
  upload.single("image"),
  handleUploadErrors,
  imageController.updateImage
);
router.delete("/:id", authUser, imageController.deleteImage);
export default router;
