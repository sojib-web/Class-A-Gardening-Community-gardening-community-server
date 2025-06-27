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
    origin: "https://gardening-community-client.web.app",
  })
);
app.use(express.json());

// MongoDB connection
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
    // await client.connect();
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

    // ✅ GET all gardeners
    app.get("/gardening", async (req, res) => {
      const activeGardeners = await gardeningCollection.find().toArray();
      res.send(activeGardeners);
    });

    // ✅ GET single gardener by ID
    app.get("/gardening/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const gardener = await gardeningCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!gardener) {
          return res.status(404).send({ message: "Gardener not found" });
        }
        res.send(gardener);
      } catch (error) {
        console.error("Error fetching gardener by ID:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ✅ Add a gardener
    app.post("/gardening", async (req, res) => {
      const gardening = req.body;

      // Simple validation
      if (!gardening || Object.keys(gardening).length === 0) {
        return res.status(400).send({ message: "Invalid gardener data" });
      }

      try {
        const result = await gardeningCollection.insertOne(gardening);
        res.send(result);
      } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send({ message: "Failed to add gardener" });
      }
    });

    // ✅ Delete a gardener by ID
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

    // ✅ Get all top trending tips
    app.get("/top-trending-tips", async (req, res) => {
      const topTrendingTips = await TopTrendingTips.find().toArray();
      res.send(topTrendingTips);
    });

    // ✅ Add a top trending tip
    app.post("/top-trending-tips", async (req, res) => {
      const tip = req.body;
      if (!tip || Object.keys(tip).length === 0) {
        return res.status(400).send({ message: "Invalid tip data" });
      }
      try {
        const result = await TopTrendingTips.insertOne(tip);
        res.send(result);
      } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send({ message: "Failed to add top trending tip" });
      }
    });

    // ✅ Get all shared garden tips
    app.get("/share-garden-tip", async (req, res) => {
      const tips = await ShareGardenTip.find().toArray();
      res.send(tips);
    });

    // ✅ Add a shared garden tip
    app.post("/share-garden-tip", async (req, res) => {
      const tip = req.body;
      if (!tip || Object.keys(tip).length === 0) {
        return res.status(400).send({ message: "Invalid tip data" });
      }
      try {
        const result = await ShareGardenTip.insertOne(tip);
        res.send(result);
      } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send({ message: "Failed to add shared garden tip" });
      }
    });

    // ✅ Get a shared tip by ID
    app.get("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const tip = await ShareGardenTip.findOne({ _id: new ObjectId(id) });
        if (!tip) {
          return res.status(404).send({ message: "Tip not found" });
        }
        res.send(tip);
      } catch (error) {
        console.error("Error fetching tip by ID:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ✅ Update a shared tip by ID
    app.put("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      try {
        const result = await ShareGardenTip.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating tip:", error);
        res.status(500).send({ message: "Failed to update tip" });
      }
    });

    // ✅ Delete a shared tip by ID
    app.delete("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await ShareGardenTip.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ success: true, message: "Tip deleted successfully" });
        } else {
          res.status(404).send({ success: false, message: "Tip not found" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ success: false, message: "Server error", error });
      }
    });

    // Root route
    app.get("/", (req, res) => {
      res.send("Gardening server is getting hotter.!");
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Gardening server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

run().catch(console.dir);
