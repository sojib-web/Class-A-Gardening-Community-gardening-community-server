const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
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
    // Connect the client to the server
    await client.connect();
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

    // Get all gardeners
    app.get("/gardening", async (req, res) => {
      const activeGardeners = await gardeningCollection.find().toArray();
      res.send(activeGardeners);
    });

    // Add a gardener
    app.post("/gardening", async (req, res) => {
      const gardening = req.body;
      console.log(gardening);
      const result = await gardeningCollection.insertOne(gardening);
      res.send(result);
    });

    // Delete a gardener by id
    app.delete("/gardening/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await gardeningCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ success: true, message: "Gardener deleted successfully" });
        } else {
          res
            .status(404)
            .send({ success: false, message: "Gardener not found" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ success: false, message: "Server error", error });
      }
    });

    // Get all top trending tips
    app.get("/top-trending-tips", async (req, res) => {
      const topTrendingTips = await TopTrendingTips.find().toArray();
      res.send(topTrendingTips);
    });

    // Add a top trending tip
    app.post("/top-trending-tips", async (req, res) => {
      const gardening = req.body;
      console.log(gardening);
      const result = await TopTrendingTips.insertOne(gardening);
      res.send(result);
    });

    // Get all shared garden tips
    app.get("/share-garden-tip", async (req, res) => {
      const shareGardenTip = await ShareGardenTip.find().toArray();
      res.send(shareGardenTip);
    });

    // Add a shared garden tip
    app.post("/share-garden-tip", async (req, res) => {
      const schedule = req.body;
      const result = await ShareGardenTip.insertOne(schedule);
      res.send(result);
    });

    // Get a shared garden tip by id
    app.get("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const tip = await ShareGardenTip.findOne({ _id: new ObjectId(id) });
      res.send(tip);
    });

    // Update a shared garden tip by id
    app.put("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await ShareGardenTip.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    // Delete a shared garden tip by id
    app.delete("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ShareGardenTip.deleteOne(query);
      res.send(result);
    });

    // Root route
    app.get("/", (req, res) => {
      res.send("Gardening server is getting hotter.!");
    });

    // Start server
    app.listen(port, () => {
      console.log(`Gardening server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

run().catch(console.dir);
