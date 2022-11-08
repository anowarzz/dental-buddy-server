const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// Middle Wares
app.use(cors());
app.use(express.json());





// Server run check
app.get('/', (req,res) => {
    res.send("Assignment 11 Server is running successfully")
})

// Server check on console
app.listen(port, () => {
    console.log(`Assignment Server Running On Port ${port}`)
})