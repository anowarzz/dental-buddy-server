const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
var jwt = require("jsonwebtoken");

// Middle Wares
app.use(cors());
app.use(express.json());

// Mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v1rp4a3.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Verify JWT
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

// Function for CRUD Operation

async function run() {
  try {
    const serviceCollection = client.db("dentalBuddy").collection("services");

    const reviewCollection = client.db("dentalBuddy").collection("reviews");

    // JWT Token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    //Services API - Loading Only 3  Services for Home Page from DB
    app.get("/top-services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ created: -1 });
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //Services API - Loading All services  from DB
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ created: -1 });
      const services = await cursor.toArray();
      res.send(services);
    });

    // Loading Single Service Details from DB
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
      console.log(service);
    });

    // Adding A Service To DB
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // Adding Reviews to DB
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Loading Service Reviews From DB Using Service Id
    app.get("/serviceReviews", async (req, res) => {
      let query = {};
      if (req.query.serviceId) {
        query = {
          serviceId: req.query.serviceId,
        };
      }
      const cursor = reviewCollection.find(query).sort({ created: -1 });
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Loading My reviews using email
    app.get("/myReviews", verifyJWT, async (req, res) => {

      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        return res.send(403).send({ message: "Unauthorized Access" });
      }

      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query).sort({ created: -1 });
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Deleting One review
    app.delete("/reviews/:id", verifyJWT async (req, res) => {
      console.log(req.params);

      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        return res.send(403).send({ message: "Unauthorized Access" });
      }

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    // Editing One Review
    app.patch("/reviews/id", async (req, res) => {
      const id = req.params.id;
      const reviewText = req.body.reviewText;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          reviewText: reviewText,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}

run().catch((error) => console.error(error));

// Server run check
app.get("/", (req, res) => {
  res.send("Dental Buddy  is running successfully");
});

// Server check on console
app.listen(port, () => {
  console.log(`Dental Buddy Running On Port ${port}`);
});
