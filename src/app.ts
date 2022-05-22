import cors from "cors";
import express, { Application } from "express";
import { BaseRoutes } from "./v1/routes";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();

app.use(express.json({ limit: "50mb" }));
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use("/v1", new BaseRoutes().getRouter());
app.get("/", (req, res) => {
	res.send("Server is functional!.");
});

app.listen(PORT, () => {
	console.log(`running on port ${PORT}`);
});

export default app;