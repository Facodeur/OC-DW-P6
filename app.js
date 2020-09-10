const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const SauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://facodeur:facodeur1234@cluster0.je0rp.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join( __dirname, 'images' )));

app.use('/api/sauces', SauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;


// const mongoose = require('mongoose');
// const dotenv = require('dotenv').config();
// let db = process.env.DB_USER; const pwd = process.env.DB_PASS; let dbName = process.env.DB_NAME;
// mongoose.connect(`mongodb+srv://${db}:${pwd}@cluster-p-six-oc-kum0q.mongodb.net/${dbName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
