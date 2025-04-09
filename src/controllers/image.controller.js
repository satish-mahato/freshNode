import imageService from "../services/image.service.js";

class ImageController {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const image = await imageService.createImage(req.file, req.body);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({
        error: error.message || "Failed to upload image",
      });
    }
  }

  async getAllImages(req, res) {
    try {
      const images = await imageService.getAllImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch images",
      });
    }
  }

  async getImageById(req, res) {
    try {
      const { id } = req.params;

      const image = await imageService.getImageById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: image,
      });
    } catch (error) {
      if (
        error.message.toLowerCase().includes("invalid") ||
        error.message.toLowerCase().includes("parsing")
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
          error: error.message,
        });
      }

      console.error("Error fetching image:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching image",
        error: error.message,
      });
    }
  }

  async updateImage(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const fileData = req.file;

      const metadata = { title };
      const updatedImage = await imageService.updateImage(
        id,
        fileData,
        metadata
      );

      res.json(updatedImage);
    } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({
        error: error.message || "Failed to update image",
      });
    }
  }

  async deleteImage(req, res) {
    try {
      const { id } = req.params;
      await imageService.deleteImage(id);
      res.json({
        success: true,
        message: "Image deleted successfully",
        deletedId: id,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete image",
      });
    }
  }
}

export default new ImageController();
