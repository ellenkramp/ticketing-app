import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo");
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("listening on 3000!!!");
});

start();
