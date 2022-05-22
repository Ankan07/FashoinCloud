import { Db, ObjectId } from "mongodb";
import { Request, Response } from "express";
import { Cache, Counter } from "../models/Cache";
import { Validation } from "../../Utils/validation";
export class CacheFunctions {
  private COLLECTION: string = "cache";
  private COUNTER: string = "counter";
  private CACHE_LIMIT: number = 3; // maximum number of keys
  private TTL: number = 10000; // in milliseconds
  constructor(private db: Db) {}

  async cacheHit(
    req: Request,
    res: Response,
    key: string,
    response_value: any,
    result: Cache
  ) {
    // cache hit
    console.log("Cache hit");
    let updateQuery: any = {
      readAt: new Date().getTime(),
    };
    // check if TTL expired
    if (new Date().getTime() - result["readAt"] > this.TTL) {
      updateQuery["value"] = `FASHION-${Math.floor(Math.random() * 100 + 1)}`;
      response_value = updateQuery["value"];
    }
    // update the cache data
    await this.db
      .collection(this.COLLECTION)
      .updateOne({ _id: new ObjectId(result["_id"]) }, { $set: updateQuery });
    res.status(200).send({ status: true, key: key, value: response_value });
  }

  async cacheMiss(req: Request, res: Response, key: string) {
    // cache miss
    console.log("Cache miss");
    // check the no of cache items
    const result: Counter | null = await this.db
      .collection(this.COUNTER)
      .findOne({});
    // if no of items in cache limit reached
    if (result && result.counter >= this.CACHE_LIMIT) {
      console.log("cache limit reached");
      // least used cache with respect to readAt (timestamp)
      const sorted_cache: Array<Cache> | null = await this.db
        .collection(this.COLLECTION)
        .find({})
        .sort({ readAt: 1 })
        .toArray();
      // update the least frequently used cache witn respect to time (readAt)
      let updatedcacheValue: string = `FASHION-${Math.floor(
        Math.random() * 100 + 1
      )}`;
      await this.db.collection(this.COLLECTION).updateOne(
        { _id: new ObjectId(sorted_cache[0]._id) },
        {
          $set: {
            key: key,
            value: updatedcacheValue,
            readAt: new Date().getTime(),
          },
        }
      );

      res
        .status(200)
        .send({ status: true, key: key, value: updatedcacheValue });
    }
    //within cache limit do plain insert
    else {
      console.log("inserting new key");
      const insert_new = await this.db.collection(this.COLLECTION).insertOne({
        key: key,
        value: `FASHION-${Math.floor(Math.random() * 100 + 1)}`,
        readAt: new Date().getTime(),
      });

      // update the counter value after new key insertion
      if (result)
        await this.db.collection(this.COUNTER).updateOne(
          { _id: new ObjectId(result._id) },
          {
            $set: {
              counter: result.counter + 1,
            },
          }
        );
      res
        .status(200)
        .send({ status: true, key: key, value: insert_new.ops[0].value });
    }
  }

  async readCache(req: Request, res: Response) {
    try {
      const key: string = req.params.key;
      const result: Cache | null = await this.db
        .collection(this.COLLECTION)
        .findOne({ key });
      let response_value: any = result?.value;
      if (result) {
        await this.cacheHit(req, res, key, response_value, result);
      } else {
        await this.cacheMiss(req, res, key);
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ status: false, message: "Internal Server Error", error: err });
    }
  }

  async returnStoredKeys(req: Request, res: Response) {
    try {
      const result = await this.db
        .collection(this.COLLECTION)
        .find(
          {},
          {
            projection: { _id: 0, key: 1 },
          }
        )
        .toArray();
      res
        .status(200)
        .send({ status: true, message: "All keys from cache", data: result });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ status: false, message: "Internal Server Error", error: err });
    }
  }

  async updateAkey(req: Request, res: Response) {
    try {
      const key = req.body.key;
      const value = req.body.value;
      const status:boolean = await new Validation().validate(req,res);
      if(status){
         // find the key
      const result = await this.db.collection(this.COLLECTION).findOne({ key });
      if (result) {
        const update = await this.db
          .collection(this.COLLECTION)
          .updateOne({ key }, { $set: { value } });
        res
          .status(200)
          .send({ status: true, message: "Updated the key successfully" });
      } else {
        res.status(200).send({ status: false, message: "Key does not exist" });
      }
      }
      else{
        res.status(400).send({ status: false, message: "Invalid Parameters" });
      }
     
    } catch (err) {
      res.status(500).send({ status: false, message: "Internal Server Error" });
    }
  }

  async removeAkey(req: Request, res: Response) {
    try {
      const key = req.params.key;
      // find the key
      const result = await this.db.collection(this.COLLECTION).findOne({ key });
      if (result) {
        const update = await this.db
          .collection(this.COLLECTION)
          .deleteOne({ key });
        res
          .status(200)
          .send({ status: true, message: "Deleted the key successfully" });
      } else {
        res.status(200).send({ status: false, message: "Key does not exist" });
      }
    } catch (err) {
      res.status(500).send({ status: false, message: "Internal Server Error" });
    }
  }

  async removeAllkeys(req: Request, res: Response) {
    try {
      const key = req.body.key;
      const result = await this.db.collection(this.COLLECTION).deleteMany({});
      // reset cache counter to 0
      await this.db.collection(this.COUNTER).deleteMany({});
      await this.db.collection(this.COUNTER).insertOne({ counter: 0 });
      res
        .status(200)
        .send({ status: true, message: "Deleted all the key successfully" });
    } catch (err) {
      res.status(500).send({ status: false, message: "Internal Server Error" });
    }
  }
}
