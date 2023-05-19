const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7pcrxo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    client.connect((error) => {
      if (error) {
        console.error(error);
        return;
      }
    });

    const allAnimalToysCollection = client.db("AnimalDb").collection("Animal");

    app.get("/allToys", async (req, res) => {
      let query = {};
      if(req.query?.email){
        query = {sellerEmail: req.query.email}
      }
      const result = await allAnimalToysCollection.find(query).sort({price: 1}).limit(20).toArray();
      res.send(result)
    });

    




    app.post('/addtoys', async (req, res) => {
      const body = req.body;
      const result = await allAnimalToysCollection.insertOne(body);
      res.send(result);
    })

    app.delete('/allToys/:id', async(req,res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result  = await allAnimalToysCollection.deleteOne(query)
      res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("wassup");
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
