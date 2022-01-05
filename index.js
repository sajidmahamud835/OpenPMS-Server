const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnuoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db(`openpms`);
    const projectsCollection = database.collection('projects');
    const tasksCollection = database.collection('tasks');

    // // Post api
    app.post('/projects', async (req, res) => {
      const project = req.body;
      console.log('hitted!', project);

      const result = await projectsCollection.insertOne(project);
      console.log(result);
      res.json(result);
    });

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      console.log('hitted!', task);

      const result = await tasksCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    // Get products api
    app.get('/projects', async (req, res) => {
      const cursor = projectsCollection.find({});
      const projects = await cursor.toArray();
      const count = await cursor.count();
      res.send({
        count,
        projects
      });
    })

    app.get('/tasks', async (req, res) => {
      const cursor = tasksCollection.find({});
      const tasks = await cursor.toArray();
      const count = await cursor.count();
      res.send({
        count,
        tasks
      });
    })

    //UPDATE API
    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedData.status
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc, options)
      console.log('updating user', id)
      res.json(result);
    })

    // Delete api
    app.delete('/projects/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await projectsCollection.deleteOne(query);
      res.json(result);
    })

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log('server is running at port', port);
})