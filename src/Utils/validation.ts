import { Db, MongoClient } from "mongodb";
import { Request, Response } from "express";
export class Validation {
  constructor() {}

  async validate(req: Request, res: Response) {
    let status: boolean = true;
    if (!req.body.key || !req.body.value) {
      status = false;
    } else if (
      typeof req.body.key !== "string" ||
      typeof req.body.value !== "string"
    ) {
      status = false;
    }
    return status;
  }
}
