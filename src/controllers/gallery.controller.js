import { galleryService } from "../services/gallery.service.js";
import { cacheUtil } from "../utils/cache.util.js";
import { fileService } from "../services/file.service.js";

export const galleryController = {
  async uploadGalleryFiles(req, res, next) {
    try {
      const { title, date } = req.body;
      if (!req.files?.length) {
        return res.status(400).json({ error: "Files are required" });
      }

      const newGallery = await galleryService.createGallery(
        { title, date: new Date(date) },
        req.files
      );

      await cacheUtil.invalidate([cacheUtil.keys.ALL_GALLERIES]);
      res.status(201).json({
        message: "Gallery created successfully",
        data: newGallery,
      });
    } catch (err) {
      next(err);
    }
  },

  async editGalleryFiles(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const galleryId = parseInt(id);

      const existingGallery = await galleryService.getGallery(galleryId);
      if (!existingGallery) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      if (req.files?.length && existingGallery.files?.length) {
        await fileService.deleteGalleryFiles(existingGallery.files);
      }

      const updatedGallery = await galleryService.updateGallery(
        galleryId,
        updates,
        req.files
      );

      await cacheUtil.invalidate([
        cacheUtil.keys.gallery(id),
        cacheUtil.keys.ALL_GALLERIES,
      ]);

      res.status(200).json({
        message: "Gallery updated successfully",
        data: updatedGallery,
      });
    } catch (err) {
      next(err);
    }
  },
  async getGalleryFiles(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = cacheUtil.keys.gallery(id);

      const gallery = await cacheUtil.getOrSet(cacheKey, async () => {
        const data = await galleryService.getGallery(parseInt(id));
        if (!data) throw new Error("Gallery not found");
        return data;
      });

      res.json({ data: gallery });
    } catch (err) {
      next(err);
    }
  },

  async deleteGalleryFiles(req, res, next) {
    try {
      const { id } = req.params;
      const galleryId = parseInt(id);

      const gallery = await galleryService.deleteGallery(galleryId);
      if (!gallery) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      await fileService.deleteGalleryFiles(gallery.files);
      await cacheUtil.invalidate([
        cacheUtil.keys.gallery(id),
        cacheUtil.keys.ALL_GALLERIES,
      ]);

      res.json({ message: "Gallery deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  async getAllGalleryFiles(req, res, next) {
    try {
      const galleries = await cacheUtil.getOrSet(
        cacheUtil.keys.ALL_GALLERIES,
        galleryService.getAllGalleries
      );

      res.json({
        message: "Galleries retrieved successfully",
        data: galleries,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default galleryController;
