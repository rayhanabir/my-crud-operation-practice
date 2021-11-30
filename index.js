const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


const port = 5000;


//username : mydbuser2
//pass: rayhan915


const uri = "mongodb+srv://mydbuser2:rayhan915@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("ecommerce");
      const productsCollection = database.collection("products");
     
      //post methode

      app.post('/products', async(req, res)=>{
          const newProduct = req.body;
          const result = await productsCollection.insertOne(newProduct);
          console.log('hitting the post', req.body);
          console.log('added products', result);
          res.json(result);
      })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('my server is ready man')
})

app.listen(port, ()=>{
    console.log(`Running my port, ${port}`)
})