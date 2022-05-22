import { ObjectId } from "mongodb";

export interface Cache {
  _id?: ObjectId;
  key: string;
  value: string;
  readAt: number;
}
export interface Counter {
  _id?: ObjectId;
  counter: number;
}
