// @ts-nocheck
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "https://gardening-community-client.web.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sh3fzt7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // এখানে অবশ্যই কানেক্ট করতে হবে
    console.log("Connected to MongoDB!");

    const gardeningCollection = client
      .db("gardeningDB")
      .collection("gardening");
    const TopTrendingTips = client
      .db("gardeningDB")
      .collection("TopTrendingTips");
    const ShareGardenTip = client
      .db("gardeningDB")
      .collection("ShareGardenTip");

    // রাউটগুলো এখানে থাকবে যেমন তোমার কোডে আছে

    app.get("/gardening", async (req, res) => {
      const activeGardeners = await gardeningCollection.find().toArray();
      res.send(activeGardeners);
    });

    // অন্যান্য রাউট...

    app.get("/", (req, res) => {
      res.send("Gardening server is getting hotter.!");
    });

    app.listen(port, () => {
      console.log(`Gardening server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

run().catch(console.dir);
