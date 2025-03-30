// server/models/Poll.js
const mongoose = require('mongoose');
const PollSchema = new mongoose.Schema({
    question: String,
    options: [String],
    responses: [{ studentName: String, answer: String }],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Poll', PollSchema);