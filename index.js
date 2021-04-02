const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@minibytes.dgx5f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port);

app.get('/',(req,res) => {
    res.send("Hello")
})
client.connect(err => {
    const productCollection = client.db("SimpleEcomDB").collection("products");
    const ordersCollection = client.db("SimpleEcomDB").collection("orders");
    console.log("connected");
    app.get('/products', (req,res) => {
        productCollection.find({})
        .toArray((err,documents) => {
            res.send(documents);
        })
    })
    app.get('/product/:id',(req,res) =>{
        productCollection.find({ _id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })
    app.get('/orders/:name', (req, res) => {
        ordersCollection.find({name : req.params.name})
            .toArray((err, documents) => {
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
    app.post('/orders',(req,res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(res=> {
            console.log(res)
        })
    })
    app.delete('/delete/:id',(req,res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id)})
    })
});