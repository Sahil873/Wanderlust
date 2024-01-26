const mongoose = require("mongoose");
let { data } = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  data = data.map((obj) => ({ ...obj, owner: "65a96931daee6e0efb180cfc" }));
  await Listing.insertMany(data);
  console.log("Data was initialized successfully");
};

initDB();
