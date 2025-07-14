import express from "express";
import fileController from "../../../controllers/notice.controller.js";
import {
  upload,
  handleUploadErrors,
} from "../../../middleware/multerConfig.js";
import { validateRequest } from "../../../middleware/validation.js";
import {
  fileUploadSchema,
  fileEditSchema,
} from "../../../schemas/file.schema.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "file" }, { name: "image" }]),
  handleUploadErrors,
  validateRequest(fileUploadSchema),
  (req, res, next) => {
    if (!req.files?.file && !req.files?.image) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          {
            msg: "Either file or image is required",
            param: "files",
            location: "body",
          },
        ],
      });
    }
    next();
  },
  fileController.uploadFiles
);

router.get("/", fileController.getFiles);
router.get("/:category", fileController.getFilesByCategory);

router.put(
  "/:category/:id",
  validateRequest(fileEditSchema),
  fileController.editFile
);

router.delete("/:category/:id", fileController.deleteFile);

export default router;
