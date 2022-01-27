//import
import express from "express";
import Messages from "./dbMessages.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

//app config
const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(express.json());
app.use(cors());

//DB config
const connection_url =
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.1xl8b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

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
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    })
})

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));


//mongodb+srv://admin:<password>@cluster0.1xl8b.mongodb.net/test
