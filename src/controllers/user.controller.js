import redisClient from "../services/redis.service.js";
import {
  createUser,
  loginUser,
  findUserById,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
} from "../services/user.service.js";
import { getFromRedis, setInRedis } from "../utils/auth.js";

import {
  handleControllerError,
  clearUserCache,
  sanitizeUser,
} from "../utils/controllerHelpers.js";


const controllerHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    handleControllerError(res, error);
  }
};


export const createUserController = controllerHandler(async (req, res) => {
  const user = await createUser(req.body);
  await clearUserCache(user.id);

  res.status(201).json({
    message: "User registered successfully",
    user: sanitizeUser(user),
  });
});


export const loginUserController = controllerHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);

  res.status(200).json({
    message: "Login successful",
    user: sanitizeUser(user),
    token,
  });
});


export const userProfileController = controllerHandler(async (req, res) => {
  const redisKey = `user:profile:${req.user.id}`;
  const cachedProfile = await getFromRedis(redisKey);

  if (cachedProfile) return res.json(cachedProfile);

  const user = await findUserById(req.user.id);
  await setInRedis(redisKey, user);

  res.json(sanitizeUser(user));
});


export const updateUserProfileController = controllerHandler(
  async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name && !email) {
      throw new UserError("At least one field (name, email) must be provided");
    }

    const updatedUser = await updateUserProfile(userId, { name, email });
    await clearUserCache(userId);

    res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser),
    });
  }
);


export const changePasswordController = controllerHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await changePassword(req.user.id, oldPassword, newPassword);

  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    await redisClient.set(token, "logout", "EX", 86400); // 24h in seconds
  }

  res.status(200).json({ message: "Password changed successfully" });
});


export const logoutController = controllerHandler(async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AuthenticationError("Token required for logout");
  }

  await redisClient.set(token, "logout", "EX", 86400);
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
});

export const getAllUsersController = controllerHandler(async (req, res) => {
  const users = await getAllUsers(req.user.id);
  const sanitizedUsers = users.map(user => sanitizeUser(user));
  res.status(200).json(sanitizedUsers);
});


export const deleteUserController = controllerHandler(async (req, res) => {
  const userId = parseInt(req.params.id); 
  const requestingUser = req.user;

console.log("userid",userId);
console.log("requesting id",requestingUser)
  if (!requestingUser.isAdmin) {
    return res.status(403).json({ message: "Only administrators can delete users" });
  }

  console.log("Deleting user ID:", userId);
  await deleteUser(userId);
  await clearUserCache(userId);

  if (requestingUser.id === userId) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await redisClient.set(token, "logout", "EX", 86400);
      res.clearCookie("token");
    }
  }

  res.status(200).json({ message: "User deleted successfully" });
});