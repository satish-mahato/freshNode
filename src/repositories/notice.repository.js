
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class NoticeRepository {
  async createPdfFile(data) {
    return await prisma.noticePdf.create({ data });
  }

  async createImageFile(data) {
    return await prisma.noticeImage.create({ data });
  }
}

export default new NoticeRepository();