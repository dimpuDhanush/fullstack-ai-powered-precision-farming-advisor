import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";

import { config } from "./config.js";
import { initDb } from "./db.js";
import { router } from "./routes.js";

initDb();

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve(config.uploadDir)));
app.use("/api", router);

app.get("/", (_req, res) =>
  res.json({ ok: true, name: "precision-farming-api" })
);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${config.port}`);
});
