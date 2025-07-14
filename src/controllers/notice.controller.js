import fileService from "../services/notice.service.js";

export const uploadFiles = async (req, res, next) => {
  try {
  
    const result = await fileService.uploadFiles(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFiles = async (req, res, next) => {
  try {
    const result = await fileService.getFiles();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFilesByCategory = async (req, res, next) => {
  try {
    const result = await fileService.getFilesByCategory(req.params.category);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const editFile = async (req, res, next) => {
  try {
    const { id, category } = req.params;
    const { title } = req.body;

    if (!id || !category) {
      throw new Error("Missing id or category in parameters");
    }
    if (!title) {
      throw new Error("Title is required in request body");
    }

    const result = await fileService.editFile(req.params, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in editFile controller:", error.message);
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const result = await fileService.deleteFile(req.params);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFiles,
  getFiles,
  getFilesByCategory,
  editFile,
  deleteFile,
};