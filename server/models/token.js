const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: { type : mongoose.Schema.ObjectId, ref: 'user', required: true },
    token: { type: String, required: true }
});

const ModelClass = mongoose.model('token', tokenSchema);

module.exports = ModelClass;