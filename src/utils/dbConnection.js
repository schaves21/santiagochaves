import { connect } from "mongoose";

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://schaves:SNEm7PTJfvLHDy4g@ecommerce.i4y5xac.mongodb.net/?retryWrites=true&w=majority",
      {
        dbName: "ecommerce",
      }
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
