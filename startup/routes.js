import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from "path";
import exphbs from "express-handlebars";
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
  
  // View engine (Handlebars) with helpers
  app.engine(
    "handlebars",
    exphbs.engine({
      defaultLayout: false,
      helpers: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b,
        and: (...args) => args.slice(0, -1).every(Boolean),
        add: (a, b) => Number(a) + Number(b),
        multiply: (a, b) => Number(a) * Number(b),
        isEven: (n) => Number(n) % 2 === 0,
        formatNumber: (value) => {
          const num = Number(value);
          return Number.isFinite(num) ? num.toLocaleString("en-US") : "";
        },
        progressWidth: (value, maxValue, width) => {
          const v = Number(value);
          const m = Number(maxValue);
          const w = Number(width);
          if (!Number.isFinite(v) || !Number.isFinite(m) || !Number.isFinite(w) || m === 0) return 0;
          const computed = (v / m) * w;
          return Math.max(0, Math.min(w, Math.round(computed)));
        },
        truncate: (str, max) => {
          const s = String(str ?? "");
          const m = Number(max) || 0;
          return s.length > m ? `${s.substring(0, m)}...` : s;
        },
        isAccepted: (status) => String(status ?? "").toLowerCase().includes("accepted"),
        ternary: (cond, a, b) => (cond ? a : b),
      },
    })
  );
  app.set("view engine", "handlebars");
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