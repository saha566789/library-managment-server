const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkenfit.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const bookCollection = client.db('BookDB').collection('library')
    

    app.get('/libraries/:category_name', async (req, res)=>{
        const category_name= req.params.category_name;
       
        const result = await bookCollection.find({ 'Category': category_name }).toArray();
        res.send(result);
    })


    app.get('/libraries',async(req,res)=>{
        const cursor = bookCollection.find()
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/libraries', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await bookCollection.insertOne(newProduct);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('library store server is running')
})


app.listen(port,() =>{
    console.log(`library is running on port : ${port}`)
})