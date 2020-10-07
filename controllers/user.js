require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gestion enregistrement utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // hashage du password
    .then( hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then( () => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch( error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};

// Gestion de connection utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // récup du mail utilisateur
      .then(user => {
        if (!user) { // si pas trouvé :  message d'erreur
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // si trouvé compare les passwords
          .then(valid => {
            if (!valid) { // si pas identique : message erreur
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ // si identique 
              userId: user._id,
              token: jwt.sign( // création du token
                  { userId: user._id },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};