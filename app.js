import express from "express";
import errorHandlingMiddleware from "./src/middlewares/error-handling.mddleware.js";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 3007;

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
