const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middle Wares
app.use(cors());
app.use(express.json());




// Mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v1rp4a3.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// Function for CRUD Operation

async function run () {
    try {
        const serviceCollection = client.db('dentalBuddy').collection('services')


        //Services API - Loading Only 3  Services for Home Page from DB
        app.get('/top-services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        //Services API - Loading All services  from DB
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
        })


        // Loading Single Service Details from DB
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id);
            
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
            console.log(service);
            
        })


    }







    finally{

    }
}

run().catch(error => console.error(error))




// Server run check
app.get('/', (req,res) => {
    res.send("Assignment 11 Server is running successfully")
})

// Server check on console
app.listen(port, () => {
    console.log(`Assignment Server Running On Port ${port}`)
})