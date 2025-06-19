import { MongoClient } from "mongodb";

const uri = "mongodb+srv://seth:seth123@cluster0.zpmmmqz.mongodb.net/Tech3_Stores?retryWrites=true&w=majority";

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each connection
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
