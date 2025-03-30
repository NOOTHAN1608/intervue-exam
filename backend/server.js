const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// Candidate schema
const candidateSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    email: { type: String, required: true ,unique: true },
    studentId: { type: String, required: true },
});
const Candidate = mongoose.model('Candidate', candidateSchema);
// Quiz Schema
const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Quiz = mongoose.model('Quiz', quizSchema);
// Question Schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: false },
    type: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
});
const Question = mongoose.model('Question', questionSchema);
// Answer Schema
const answerSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: String, required: true },
});
const Answer = mongoose.model('Answer', answerSchema);
// Endpoint to register a candidate
app.post('/api/registerCandidate', async (req, res) => {
    const { studentName, email, studentId } = req.body;
    const newCandidate = new Candidate({ studentName, email, studentId });
    try {
        await newCandidate.save();
        res.status(201).json({ message: 'Candidate registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering candidate', error });
    }
});
// Endpoint to create a quiz
app.post('/api/createQuiz', async (req, res) => {
    const { quizName } = req.body;
    const newQuiz = new Quiz({ name: quizName });
    try {
        await newQuiz.save();
        res.status(201).json({ message: 'Quiz created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating quiz', error });
    }
});
// Endpoint to add a question
app.post('/api/addQuestion', async (req, res) => {
    const { question, options, type, correctAnswer, quizName } = req.body;
    const quiz = await Quiz.findOne({ name: quizName });
    if (!quiz) {
        return res.status(400).json({ message: 'Quiz not found' });
    }
    const newQuestion = new Question({ question, options, type, correctAnswer, quizId: quiz._id });
    try {
        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error adding question', error });
    }
});
// Endpoint to get questions
app.get('/api/getQuestions', async (req, res) => {
    try {
        const questions = await Question.find().populate('quizId');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
});
// Endpoint to save an answer
app.post('/api/saveAnswer', async (req, res) => {
    const { questionId, answer, studentId } = req.body;
    const newAnswer = new Answer({ studentId, questionId, answer });
    try {
        await newAnswer.save();
        res.status(201).json({ message: 'Answer saved successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error saving answer', error });
    }
});
// Endpoint to verify a Student ID
app.get('/api/verifyStudentId/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const candidate = await Candidate.findOne({ studentId });
        if (candidate) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying Student ID', error });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});