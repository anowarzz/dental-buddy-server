const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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


        //Services API - Loading All Services from DB

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
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