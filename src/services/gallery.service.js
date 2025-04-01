import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const galleryService = {
  async createGallery(data, files) {
    return prisma.galleryImg.create({
      data: {
        title: data.title,
        date: data.date,
        files: {
          create: files.map(file => ({
            fileName: file.originalname,
            filePath: `files/${file.filename}`
          }))
        }
      },
      include: { files: true }
    });
  },

  async updateGallery(id, data, files) {
    return prisma.$transaction(async (tx) => {
      if (files?.length) {
        await tx.galleryFile.deleteMany({ where: { galleryImgId: id } });
        await tx.galleryFile.createMany({
          data: files.map(file => ({
            fileName: file.originalname,
            filePath: `files/${file.filename}`,
            galleryImgId: id
          }))
        });
      }

      return tx.galleryImg.update({
        where: { id },
        data,
        include: { files: true }
      });
    });
  },

  async getGallery(id) {
    return prisma.galleryImg.findUnique({
      where: { id },
      include: { files: true }
    });
  },

  async deleteGallery(id) {
    return prisma.galleryImg.delete({
      where: { id },
      include: { files: true }
    });
  },

  async getAllGalleries() {
    return prisma.galleryImg.findMany({
      include: { files: true }
    });
  }
};