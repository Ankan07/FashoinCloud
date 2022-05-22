import { Router } from "express";
import { Db } from "mongodb";
import { Database } from "../Utils/database";
import { CacheRoutes } from "./cache/cacheRoutes";

export class BaseRoutes {
  private router: Router;
  constructor() {
    this.setupRoutes();
    this.router = Router();
  }
  getRouter(): Router {
    return this.router;
  }
  async setupRoutes() {
    const db: Db = await new Database().connectToMongoDb();
    console.log("db connected");
    this.router.use("/cache", new CacheRoutes(db).getRoutes());
  }
}
