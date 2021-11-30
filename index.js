const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
     
        //db theke client side a data load kortesi --get api
        //sob products k load kora hoyeche 
        app.get('/products', async(req, res)=>{
            const cursor = productsCollection.find({})
            const products = await cursor.toArray()
            res.send(products)
        })

        //single product k load kora hocche 

        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await productsCollection.findOne(query)
            console.log('got id card', id)
            res.json(result)
        })

        //update product name, price and quantity--- put method =>

      app.put('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const updatedProduct = req.body;
        const filter = {_id:ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name:updatedProduct.name,
            price:updatedProduct.price,
            quantity:updatedProduct.quantity 
          },
        };
        const result = await productsCollection.updateOne(filter, updateDoc, options)
        console.log(result);
        console.log("getting putting id", id)
        res.json(result)
    })


      //post method -- post api

      app.post('/products', async(req, res)=>{
          const newProduct = req.body;
          const result = await productsCollection.insertOne(newProduct);
          console.log('hitting the post', req.body);
          console.log('added products', result);
          res.json(result);
      })

      //delete api 

      app.delete('/products/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const result = await productsCollection.deleteOne(query);
            // console.log('deleting user', result);
          res.json(result)


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