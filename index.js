const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sh3fzt7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

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

    app.get("/gardening", async (req, res) => {
      const activeGardeners = await gardeningCollection
        .find({ status: "active" })
        .limit(6)
        .toArray();
      res.send(activeGardeners);
    });

    app.post("/gardening", async (req, res) => {
      const gardening = req.body;
      console.log(gardening);
      const result = await gardeningCollection.insertOne(gardening);
      res.send(result);
    });

    // top-trending-tips
    app.get("/top-trending-tips", async (req, res) => {
      const topTrendingTips = await TopTrendingTips.find().toArray();
      res.send(topTrendingTips);
    });

    app.post("/top-trending-tips", async (req, res) => {
      const gardening = req.body;
      console.log(gardening);
      const result = await TopTrendingTips.insertOne(gardening);
      res.send(result);
    });

    app.get("/share-garden-tip", async (req, res) => {
      const shareGardenTip = await ShareGardenTip.find().toArray();
      res.send(shareGardenTip);
    });

    app.post("/share-garden-tip", async (req, res) => {
      const schedule = req.body;
      const result = await ShareGardenTip.insertOne(schedule);
      res.send(result);
    });

    app.get("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const tip = await ShareGardenTip.findOne({ _id: new ObjectId(id) });
      res.send(tip);
    });

    app.put("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await ShareGardenTip.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/share-garden-tip/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ShareGardenTip.deleteOne(query);
      res.send(result);
    });

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
