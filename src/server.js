import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRoutes from "./routes/apiRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json()), app.use(express.urlencoded({ extended: true }));
app.use("/hello", (req, res) => {
  res.send("Hello World");
});
app.use("/api", apiRoutes);
app.use(
  "/files",
  express.static(path.join(__dirname, "files"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
    },
  })
);
app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});
