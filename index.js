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

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sh3fzt7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main function
async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // MongoDB Collections
    const gardeningCollection = client
      .db("gardeningDB")
      .collection("gardening");
    const topTrendingTipsCollection = client
      .db("gardeningDB")
      .collection("TopTrendingTips");
    const shareGardenTipCollection = client
      .db("gardeningDB")
      .collection("ShareGardenTip");

    // Root Route
    app.get("/", (req, res) => {
      res.send("🌱 Gardening server is running...");
    });

    // Gardening list
    app.get("/gardening", async (req, res) => {
      const result = await gardeningCollection.find().toArray();
      res.send(result);
    });

    // Share garden tips (all)
    app.get("/share-garden-tip", async (req, res) => {
      const result = await shareGardenTipCollection.find().toArray();
      res.send(result);
    });

    // Get single garden tip by ID
    app.get("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const result = await shareGardenTipCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Top Trending Tips Route
    app.get("/top-trending-tips", async (req, res) => {
      try {
        const trending = await shareGardenTipCollection
          .find()
          .sort({ likes: -1 }) // Assuming you have a 'likes' field
          .limit(5)
          .toArray();
        res.send(trending);
      } catch (err) {
        console.error("❌ Error fetching trending tips:", err);
        res.status(500).send({ error: "Failed to load top trending tips" });
      }
    });

    // Start Server
    app.listen(port, () => {
      console.log(`🚀 Gardening server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

// Run the server
run().catch(console.dir);
