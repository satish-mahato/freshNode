import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

class ImageService {
  constructor() {
    this.FILES_DIRECTORY = 'files';
  }

  buildFilePath(filename) {
    return path.join(this.FILES_DIRECTORY, filename);
  }

  parseId(id) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid ID format");
    }
    return parsedId;
  }

  async deleteFile(relativePath) {
    const absolutePath = path.join(__dirname, '..', relativePath);
    
    try {
      await fs.access(absolutePath);
      await fs.unlink(absolutePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to delete file at ${absolutePath}:`, err);
        throw new Error('Failed to delete file');
      }
    }
  }

  prepareImageData(fileData, metadata) {
    const { originalname, mimetype, size, filename } = fileData;
    const { title } = metadata;

    return {
      filename,
      path: this.buildFilePath(filename),
      mimetype,
      size,
      title: title || originalname
    };
  }

  async createImage(fileData, metadata) {
    const imageData = this.prepareImageData(fileData, metadata);
    return await prisma.image.create({ data: imageData });
  }

  async getAllImages() {
    return await prisma.image.findMany();
  }

  async getImageById(id) {
    return await prisma.image.findUnique({
      where: { id: this.parseId(id) }
    });
  }

  async updateImage(id, fileData, metadata) {
    const parsedId = this.parseId(id);
    const currentImage = await prisma.image.findUnique({
      where: { id: parsedId },
      select: { path: true, filename: true }
    });

    if (!currentImage) {
      throw new Error("Image not found");
    }

    const updateData = { ...metadata };

    if (fileData) {
      await this.deleteFile(currentImage.path);
      Object.assign(updateData, this.prepareImageData(fileData, metadata));
    }

    return await prisma.image.update({
      where: { id: parsedId },
      data: updateData
    });
  }

  async deleteImage(id) {
    const parsedId = this.parseId(id);
    const image = await this.getImageById(parsedId);
    
    if (!image) {
      throw new Error("Image not found");
    }

    await this.deleteFile(image.path);

    return await prisma.image.delete({
      where: { id: parsedId }
    });
  }
}

export default new ImageService();