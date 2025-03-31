import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRoutes from "./routes/apiRoutes.js"
const app = express();
app.use(express.json()), app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`server runing on PORT ${PORT}`);
});
