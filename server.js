//import
import express from "express";
import Messages from "./dbMessages.js";
import mongoose from "mongoose";
import cors from "cors";
import Pusher from "pusher";
import dotenv from "dotenv";
dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(express.json());
app.use(cors());


//for realtime update
const pusher = new Pusher({
  appId: `${process.env.aptId}`,
  key: `${process.env.KEY}`,
  secret: `${process.env.secret}`,
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
  const msgCollection = db.collection("massages");
  const changesStream = msgCollection.watch();

  changesStream.on("change", (change) => {
    // console.log("change msg here:", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;

      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});


//DB config
const connection_url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.1xl8b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Mongodb connected with server: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.log(err);
  });

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

//msgs post
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//msgs get
app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));

