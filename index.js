const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    // send food to database 
    app.post('/food', async (req, res) => {
      const food = req.body;
      const result = await foodCollection.insertOne(food);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
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