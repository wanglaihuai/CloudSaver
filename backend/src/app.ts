import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", routes);

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 8009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
