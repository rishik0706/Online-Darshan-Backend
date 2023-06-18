import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // allowing everyone.

// required in post
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




async function addUserRecord(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let inputDoc = {
      username: req.query.username,
      password: req.query.password,
      email: req.query.email,
      mobile: req.query.mobile,
    };
    await messageColl.insertOne(inputDoc);

    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function findAllUser(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let list = await messageColl.find().toArray();

    await client.close();
    res.json(list);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deleteUserRecord(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    if (!req.query.email) {
      throw new Error("Required field is missing");
    }

    // this line is for delete
    await messageColl.deleteOne({ email: req.query.email });

    // for delete all
    // await messageColl.deleteMany({});

    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// LOGIN - AUTHENTICATION
// async function loginByGet(req, res) {
//   try {
//     const uri = "mongodb://127.0.0.1:27017";
//     const client = new MongoClient(uri);

//     const db = client.db("project");
//     const messageColl = db.collection("user");

//     let query = { email: req.query.email, password: req.query.password };
//     let userRef = await messageColl.findOne(query);

//     await client.close();

//     // Negative: UserRef CANBE NULL;
//     if (!userRef) {
//       let errorMessage = `Record Not Found or Authentication Failure: ${req.query.email}`;
//       throw new Error(errorMessage);
//     }

//     // Postive Scenario
//     res.json(userRef);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// }

async function loginByPost(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let query = { email: req.body.email, password: req.body.password };
    let userRef = await messageColl.findOne(query);

    await client.close();

    // Negative: UserRef CANBE NULL;
    if (!userRef) {
      let errorMessage = `Record Not Found or Authentication Failure: ${req.body.email}`;
      throw new Error(errorMessage);
    }

    // Postive Scenario
    res.json(userRef);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// http://localhost:4000/addrecord

app.get("/adduser", addUserRecord);
app.get("/delete-user", deleteUserRecord);
app.get("/find-all-user", findAllUser);

// app.get("/login-by-get", loginByGet);
app.post("/login-by-post", loginByPost);

// http://localhost:4000/
app.listen(4000);
