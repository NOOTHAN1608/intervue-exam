// server/routes/polls.js
const express = require('express');
const Poll = require('../models/Poll');
const router = express.Router();
router.post('/', async (req, res) => {
    const newPoll = new Poll(req.body);
    await newPoll.save();
    res.status(201).send(newPoll);
});
router.get('/', async (req, res) => {
    const polls = await Poll.find();
    res.send(polls);
});
module.exports = router;