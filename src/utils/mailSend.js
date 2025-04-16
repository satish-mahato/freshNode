import nodemailer from "nodemailer";
import {
  BASE_URL,
  MAILTRAP_PASSWORD,
  MAILTRAP_SENDEREMAIL,
  MAILTRAP_USERNAME,
} from "../config/serverConfig.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAILTRAP_USERNAME,
    pass: MAILTRAP_PASSWORD,
  },
});
export const sendMail = async (user, token) => {
  try {
    const mailOption = {
      from: MAILTRAP_SENDEREMAIL,
      to: user,
      subject: "Verify your email",
      text: `Please click on the following link:
      ${BASE_URL}/api/v1/users/verify/${token}
      `,
    };

    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};
