import { Db, MongoClient } from "mongodb";

export class Database {
  private url: string =
    "mongodb+srv://ankan:sPBiDfudmDEioN0R@cluster0.qp6co.mongodb.net/?retryWrites=true&w=majority";
  private client: MongoClient = new MongoClient(this.url);
  private dbname = "fashoinCloud";
  constructor() {
    this.connectToMongoDb();
  }

  async connectToMongoDb(): Promise<Db> {
    try {
      if (!this.client || !this.client.isConnected()) {
        this.client = await MongoClient.connect(this.url, {
          useUnifiedTopology: true,
        });
      }
    } catch (err) {
      console.log("error is ", err);
    }
    return this.client.db(this.dbname);
  }
}


