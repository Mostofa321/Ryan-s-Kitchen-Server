const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// userName : mostofaKamal
// password : WtQtd3LHxyBXyB9w

// middle wares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// mongodb crud operation
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nihba2p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
  try {
    const foodCollection = client.db("foodsDb").collection("foodsCollection");
    const reviewCollection = client.db("reviewDb").collection("reviewCollection");

    // send food to database 
    app.post('/food', async (req, res) => {
      const food = req.body;
      const result = await foodCollection.insertOne(food);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    // read all food from database 
    app.get('/food', async (req, res) => {
      const home = req.query?.home;
      console.log(home);
      const query = {};
      const cursor = foodCollection.find(query);
      let result;
      if (home) {
        result = await cursor.limit(3).toArray();
      } else {
        result = await cursor.toArray();
      };
      if (result) {
        res.send(result);
      }
    });
    // read a food from database 
    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodCollection.findOne(query);
      if (result) {
        res.send(result);
      }
    });
    // send review to database 
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });
    // read reviews of a food from database 
    app.get('/review', async (req, res) => {
      const foodName = req.query?.foodName;
      const query = {foodName: foodName};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      if (result) {
        res.send(result);
      }
    });


  }
  catch (err) {
    console.log(err.name, err.message, err.stack)
  }
}
run();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})