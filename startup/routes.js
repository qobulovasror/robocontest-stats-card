import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from "path";
import __dirname from "../config/dirname.js";

import { CustomErrorMiddleware, errorMiddleware } from "../middlewares/customError.js";
import logger from "../config/logger.js";

// Routes
import robocontestRoutes from "../routes/robocontest.js";
import leetcodeRoutes from "../routes/leetcode.js";
import homeRoutes from "../routes/homeRoutes.js";
import NotFoundRoutes from "../routes/notFoundRoutes.js";

const routes = (app) => {
  // Middlewares
  app.use(bodyParser.json());
  app.use(cors());

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  app.use(express.static(path.join(__dirname, "..", "public")));
  
  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`Request received: ${req.method} ${req.url}`);
    next();
  });

  // Custom Error Middleware
  app.use(CustomErrorMiddleware);

  // Routes
  app.use("/", homeRoutes);
  app.use("/cards/robocontest", robocontestRoutes);
  app.use("/cards/leetcode", leetcodeRoutes);

  app.use(NotFoundRoutes);

  // Error Middleware
  app.use(errorMiddleware);
}

export default routes;