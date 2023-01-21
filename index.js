const express = require('express')
const cors= require('cors')
const { MongoClient } = require('mongodb');
const app = express()
const port= process.env.PORT || 8000
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ou7jc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("tours_cluster");
      const toursCollection = database.collection("tours");
      const bookingCollection = database.collection("booking_users");
      const destinationCollection = database.collection("destination");
     
      app.get('/tours',async(req,res)=>{
        const cursor = toursCollection.find({});
        const tours = await cursor.toArray();
          res.json(tours)
      })


      app.get('/tours/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const tour = await toursCollection.findOne(query);
        res.json(tour);

      })


      app.post('/tours', async (req, res) => {
        const tours = req.body;
        const result = await toursCollection.insertOne(tours);
        console.log(result);
      });


      app.get('/bookingList/:id',async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const tour = await bookingCollection.findOne(query);
        res.json(tour);

      })


      // update booking
      app.put('/bookingList/:id', async (req, res) => {
        const id = req.params.id;
        const updatedBooking = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                fullName: updatedBooking.fullName,
                email: updatedBooking.email,
                price: updatedBooking.price,
                address: updatedBooking.address,
                date: updatedBooking.date,
                phoneNo: updatedBooking.phoneNo,
                
            },
        };
        const result = await bookingCollection.updateOne(filter, updateDoc, options)
        console.log('updating', id)
        res.json(result)
      })


      // delete booking
      app.delete('/bookingList/:id', async (req, res) => {
        const _id = req.params.id;
        const query = { _id: ObjectId(_id) };
        const result = await bookingCollection.deleteOne(query);
        res.json(result);
      })


      // get booking
      app.get('/bookingList', async (req, res) => {
        const cursor = bookingCollection.find({});
        const email=req.query.email;
        const query={email:(email)};
        let exit;
        if(email){
        
          exit = await bookingCollection.find(query).toArray();
          console.log(exit);
        }
        else{
          exit = await cursor.toArray();
        }
        
        res.json(exit);
      });


      // post bookingList
      app.post('/bookingList', async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
      });


      app.get('/destinations',async(req,res)=>{
        const cursor = destinationCollection.find({});
        const destination = await cursor.toArray();
        res.json(destination)

      })

      
      app.get('/destinations/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const des= await destinationCollection.findOne(query);
        res.json(des);

      })

      
     
    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
  })
  
  // POST method route
app.listen(port,()=>{
    console.log('running the server at port',port);
})