const Sauce = require('../models/Sauce');
const fs = require('fs');

// récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// récupération de la sauce qui a été cliquée
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Gestion des users likes et dislikes de la sauce 
exports.likeSauce = (req, res, next) => {
    const user = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id }) // récuprération de la sauce
        .then(sauce => {
            if (sauce.usersLiked.includes(user)) { // Si le user aime deja la sauce et qu'il clic à nouveau sur le btn j'aime
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: user }, $inc: { likes: -1 } }) // alors je l'enleve des userLiked et je décrémente le compteur de like de 1
                    .catch(error => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.includes(user)) { // Si le user n'aime deja pas la sauce et qu'il clic à nouveau sur le btn je n'aime pas 
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: user }, $inc: { dislikes: -1 } }) // alors je l'enleve des userDisliked et je décrémente le compteur de Dislike de 1
                    .catch(error => res.status(400).json({ error }));
            }
        }).then(() => {
            if (like === 1) { // si le user aime la sauce
                Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: user }, $inc: { likes: 1 } }) // alors je met l'user dans le tableau des userLiked et j'incrémente le compteur de likes de 1
                    .then(() => res.status(200).json({ message: user + " j'aime " }))
                    .catch(error => res.status(400).json({ error }));
            } else if (like === -1) { // si le user n'aime pas la sauce 
                Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: user }, $inc: { dislikes: 1 } }) // alors je met l'user dans le tableau des userDisliked et j'incrémente le compteur de Dislikes de 1
                    .then(() => res.status(200).json({ message: user + " je n'aime pas " }))
                    .catch(error => res.status(400).json({ error }));
            }

            if (like === 0) { // le user est neutre
                res.status(200).json({ message: user + " je suis neutre " })
            }
        }).catch(error => res.status(404).json({ error }));
};

// Gestion création de sauces
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []

    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Gestion modification sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const sauceObject = req.file ? {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : {...req.body };

            if (req.internalUserId == sauce.userId) { // controle que le userId correspond userId de la sauce pour autorisé la modif
                const filename = req.file ? sauce.imageUrl.split('/images/')[1] : "";
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else { // si les userIds ne correspondent pas 
                const filename = req.file ? req.file.filename : "";
                fs.unlink(`images/${filename}`, () => {
                    res.status(401).json({ error: "Unauthorized" });
                });
             }
        }).catch(error => res.status(404).json({ error }));
};

// Gestion de suppression sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.userId == sauce.userId) { // controle que le userId correspond userId de la sauce pour autorisé la suppression
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(404).json({ error }));
                });
            } else {
                res.status(401).json({ error: "Unauthorized" });
            }
        })
        .catch(error => res.status(500).json({ error }));
};