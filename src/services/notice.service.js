import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

export const uploadFiles = async (req) => {
  try {
    const { title, category, uploadTime } = req.body;

    const uploadDateTime = uploadTime ? new Date(uploadTime) :  new Date();
    if (req.files?.file?.[0]) {
      const fileName = req.files.file[0].filename;
      await prisma.noticePdf.create({
        data: { title, category, pdf: fileName, uploadTime: uploadDateTime },
      });
    }

    if (req.files?.image?.[0]) {
      const imageName = req.files.image[0].filename;
      await prisma.noticeImage.create({
        data: { title, category, image: imageName, uploadTime: uploadDateTime },
      });
    }

    return {
      message: "Files uploaded successfully",
      title,
      category,
      uploadDateTime,
    };
  } catch (error) {
    console.error("Error in uploadFiles:", error);
    throw error;
  }
};

// Get Files Service
export const getFiles = async () => {
  const pdfs = await prisma.noticePdf.findMany();
  const images = await prisma.noticeImage.findMany();
  return { pdfs, images };
};

// Get Files by Category Service
export const getFilesByCategory = async (category) => {
  const pdfs = await prisma.noticePdf.findMany({ where: { category } });
  const images = await prisma.noticeImage.findMany({ where: { category } });
  return { pdfs, images };
};

// Edit File Service
export const editFile = async ({ category, id }, { title }) => {
  if (!title) {
    throw new Error("New title is required");
  }

  // Try to update PDF first
  const updatedPdf = await prisma.noticePdf.updateMany({
    where: { id: parseInt(id), category },
    data: { title },
  });

  if (updatedPdf.count > 0) {
    return await prisma.noticePdf.findFirst({
      where: { id: parseInt(id), category },
    });
  }

  // If PDF wasn't updated, try Image
  const updatedImage = await prisma.noticeImage.updateMany({
    where: { id: parseInt(id), category },
    data: { title },
  });

  if (updatedImage.count > 0) {
    return await prisma.noticeImage.findFirst({
      where: { id: parseInt(id), category },
    });
  }

  throw new Error("File not found");
};

// Delete File Service
export const deleteFile = async ({ category, id }) => {
  const pdf = await prisma.noticePdf.findFirst({
    where: { id: parseInt(id), category },
  });

  if (pdf) {
    fs.unlinkSync(path.join(__dirname, "../files", pdf.pdf));
    await prisma.noticePdf.delete({ where: { id: parseInt(id) } });
    return { message: "PDF deleted successfully" };
  }

  const image = await prisma.noticeImage.findFirst({
    where: { id: parseInt(id), category },
  });

  if (image) {
    fs.unlinkSync(path.join(__dirname, "../files", image.image));
    await prisma.noticeImage.delete({ where: { id: parseInt(id) } });
    return { message: "Image deleted successfully" };
  }

  throw new Error("File not found");
};

export default {
  uploadFiles,
  getFiles,
  getFilesByCategory,
  editFile,
  deleteFile,
};
