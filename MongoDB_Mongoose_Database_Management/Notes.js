// Day 1: MongoDB Notes

/*
Data Storage:
MongoDB stores data in a flexible, JSON-like format called BSON. This allows for dynamic schemas.

Types of DBs:
1. Hierarchical DBMS
2. SQL (Relational Databases)
3. NoSQL (Non-relational Databases)
S
NoSQL - MongoDB:
- What: A NoSQL database that stores data in flexible, JSON-like documents.
- Why: Provides scalability, flexibility, and high performance for modern applications.

Key Terminologies:
- Database: A container for collections.
- Collection: A group of MongoDB documents, equivalent to a table in SQL.
- Document: A record in a collection, equivalent to a row in SQL.
- Schema: Defines the structure of documents in a collection.
- Keys: Field names in a document.
- Models: Constructors compiled from Schema definitions.

Database -> Collections -> Documents
*/

// Code Examples:

// 1. Connecting to a MongoDB Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ExampleDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 2. Creating a Schema
const exampleSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

// 3. Creating a Model
const ExampleModel = mongoose.model('Example', exampleSchema);

// 4. Creating a Document
async function createDocument() {
  const doc = new ExampleModel({
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com'
  });
  await doc.save();
  console.log('Document Created:', doc);
}

createDocument();

// Day 2: MongoDB Notes

/*
MongoDB Installation:
- Download MongoDB from the official website.
- Follow the installation instructions for your operating system.
- Start the MongoDB server using the `mongod` command.

MongoDB Connection:
- Use the `mongoose.connect` method to connect to a MongoDB database.

Schema:
- A schema defines the structure of documents in a collection.

Model:
- A model is a constructor compiled from a schema definition.

CRUD Operations:
- Create: Insert new documents into a collection.
- Read: Query documents from a collection.
- Update: Modify existing documents in a collection.
- Delete: Remove documents from a collection.

Additional Concepts:
- ODM (Object Data Modeling): A way to interact with a database using objects.
- ORM (Object Relational Mapping): Maps objects to relational database tables.
- Mongoose: A popular ODM library for MongoDB.
*/

// Code Examples:

// 1. Connecting to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ExampleDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 2. Defining a Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// 3. Creating a Model
const User = mongoose.model('User', userSchema);

// 4. CRUD Operations

// Create
async function createUser() {
  const user = new User({
    name: 'Alice',
    email: 'alice@example.com',
    age: 25
  });
  await user.save();
  console.log('User Created:', user);
}

// Read
async function readUsers() {
  const users = await User.find();
  console.log('Users:', users);
}

// Update
async function updateUser() {
  const updatedUser = await User.findOneAndUpdate(
    { name: 'Alice' },
    { age: 26 },
    { new: true }
  );
  console.log('User Updated:', updatedUser);
}

// Delete
async function deleteUser() {
  const deletedUser = await User.findOneAndDelete({ name: 'Alice' });
  console.log('User Deleted:', deletedUser);
}

createUser();