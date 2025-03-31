import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/serverConfig.js";
import redisClient from "../services/redis.service.js";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const getFromRedis = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis GET error:", err);
    return null;
  }
};

export const setInRedis = async (key, value, ttlInSeconds = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlInSeconds);
  } catch (err) {
    console.error("Redis SET error:", err);
  }
};
