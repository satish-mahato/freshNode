import redisClient from "../services/redis.service.js";
import UserError, { AuthenticationError } from "./error.js";

export const handleControllerError = (res, error) => {
  console.error(error.message);

  if (error instanceof UserError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof AuthenticationError) {
    return res.status(401).json({ error: error.message });
  }

  const response = { error: "Internal server error" };
  if (process.env.NODE_ENV === "development") {
    response.details = error.message;
  }
  return res.status(500).json(response);
};

export const clearUserCache = async (userId) => {
  await Promise.all([
    redisClient.del(`user:profile:${userId}`),
    redisClient.del("all:users"),
  ]);
};

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
  verificationToken: user.verificationToken,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
