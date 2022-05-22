import { Db, ObjectId } from "mongodb";
import express from "express";
import { CacheFunctions } from "./cacheFunctions";
export class CacheRoutes {
  private functions: CacheFunctions;
  constructor(private db: Db) {
    this.functions = new CacheFunctions(db);
  }

  public getRoutes() {
    return express
      .Router()
      .post("/:key", async (req, res) => {
        this.functions.readCache(req, res);
      })
      .get("/", async (req, res) => {
        this.functions.returnStoredKeys(req, res);
      })
      .put("/", async (req, res) => {
        this.functions.updateAkey(req, res);
      })
      .delete("/:key", async (req, res) => {
        this.functions.removeAkey(req, res);
      })
      .delete("/", async (req, res) => {
        this.functions.removeAllkeys(req, res);
      });
  }
}
