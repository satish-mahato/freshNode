import prisma from "../prisma/client.js";
import { generateJWT, hashPassword, validatePassword } from "../utils/auth.js";
import UserError, { AuthenticationError } from "../utils/error.js";

export const createUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new UserError("Email is already registered");

  return prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthenticationError("Email not found");
  }

  const isValid = await validatePassword(password, user.password);
  if (!isValid) {
    throw new AuthenticationError("Incorrect password");
  }

  const token = generateJWT(user);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getAllUsers = async (excludeUserId) => {
  return prisma.user.findMany({
    where: { id: { not: excludeUserId } },
    select: { id: true, name: true, email: true },
  });
};

export const updateUserProfile = async (userId, { name, email }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });
};

export const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UserError("User not found");
  }

  const isValid = await validatePassword(oldPassword, user.password);
  if (!isValid) {
    throw new AuthenticationError("Invalid current password");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      password: await hashPassword(newPassword)
    }
  });
};