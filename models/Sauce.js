const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, require: true },
    dislikes: { type: Number, require: true },
    usersLiked: { type: [String], require: true },
    usersDisliked: { type: [String], require: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);