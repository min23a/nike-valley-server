const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@minibytes.dgx5f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(express.json());

app.listen('3001', console.log(3001));

app.get('/',(req,res) => {
    res.send("Hello")
})
client.connect(err => {
    const productCollection = client.db("SimpleEcomDB").collection("products");
    console.log("connected");
    app.get('/products', (req,res) => {
        productCollection.find({})
        .toArray((err,documents) => {
            res.send(documents);
        })
    })
    app.post('/addProduct',(req,res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(res => {
            console.log(res)
        })
    })
});