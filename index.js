const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sh3fzt7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    app.get("/gardening", async (req, res) => {
      const result = await gardeningCollection.find().toArray();
      res.send(result);
    });

    app.post("/gardening", async (req, res) => {
      const gardening = req.body;
      console.log(gardening);
      const result = await gardeningCollection.insertOne(gardening);
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
