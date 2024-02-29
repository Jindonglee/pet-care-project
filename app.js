import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ErrorHandleware from "./src/middlewares/error-handling.mddleware.js";
import LogMiddleware from "./src/middlewares/log.middleware.js";

dotenv.config();

const app = express();
const PORT = 3007;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("초면이조 : 반갑습니다");
});

app.use("/api", router);

app.use(ErrorHandleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
