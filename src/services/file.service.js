// services/file.service.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileService = {
  async deleteGalleryFiles(files) {
    const deleteOperations = files.map(async (file) => {
      try {
        const filePath = path.join(__dirname, '../', file.filePath);
        await fs.unlink(filePath);
      } catch (err) {
        logger.error(`File deletion failed: ${file.filePath}`, err);
        throw err;
      }
    });

    return Promise.allSettled(deleteOperations);
  }
};