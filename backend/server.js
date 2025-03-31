const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(bodyParser.json());
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// Candidate schema
const candidateSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    hasStartedTest: { type: Boolean, default: false }
});
const Candidate = mongoose.model('Candidate', candidateSchema);
// Quiz Schema
const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Quiz = mongoose.model('Quiz', quizSchema);
// Question Schema
const questionSchema = new mongoose.Schema({
    questionNumber: { type: Number, required: true, unique: true },
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
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
});
const Answer = mongoose.model('Answer', answerSchema);
// Final Result Schema
const finalResultSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    points: { type: Number, default: 0 }
});
const FinalResult = mongoose.model('FinalResult', finalResultSchema);
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
// New endpoint to fetch quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
});
// Endpoint to delete a quiz
app.delete('/api/deleteQuiz/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
});
// Endpoint to add a question
app.post('/api/addQuestion', async (req, res) => {
    const { questionNumber, question, options, type, correctAnswer, quizName } = req.body;
    const quiz = await Quiz.findOne({ name: quizName });
    if (!quiz) {
        return res.status(400).json({ message: 'Quiz not found' });
    }
    const existingQuestion = await Question.findOne({ questionNumber });
    if (existingQuestion) {
        return res.status(400).json({ message: 'Question number already exists' });
    }
    const newQuestion = new Question({ questionNumber, question, options, type, correctAnswer, quizId: quiz._id });
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
// Endpoint to get polling data for each option of a question
app.get('/api/getPollingData/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        const answers = await Answer.find({ questionId });
        const totalAnswers = answers.length;
        // Count the number of selections for each option
        const optionCounts = {};
        answers.forEach(answer => {
            if (optionCounts[answer.answer]) {
                optionCounts[answer.answer]++;
            } else {
                optionCounts[answer.answer] = 1;
            }
        });
        // Calculate the percentage for each option
        const pollingData = {};
        for (const option in optionCounts) {
            pollingData[option] = {
                count: optionCounts[option],
                percentage: ((optionCounts[option] / totalAnswers) * 100) || 0 // Handle division by zero
            };
        }
        res.status(200).json(pollingData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching polling data', error });
    }
});
// Endpoint to save an answer
app.post('/api/saveAnswer', async (req, res) => {
    const { questionId, answer, studentId, questionNumber } = req.body;
    const newAnswer = new Answer({ studentId, questionId, answer, questionNumber });
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
            return res.status(200).json({ exists: true, hasStartedTest: candidate.hasStartedTest });
        } else {
            return res.status(404).json({ exists: false, hasStartedTest: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying Student ID', error });
    }
});
// Endpoint to update test status
app.patch('/api/updateTestStatus', async (req, res) => {
    const { studentId } = req.body;
    try {
        await Candidate.updateOne({ studentId }, { $set: { hasStartedTest: true } });
        res.status(200).json({ message: 'Test status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating test status', error });
    }
});
// Endpoint to calculate final results
app.post('/api/calculateFinalResults', async (req, res) => {
    const { studentId } = req.body;
    try {
        const answers = await Answer.find({ studentId }).populate('questionId');
        const results = [];
        for (const answer of answers) {
            const question = await Question.findOne({ questionNumber: answer.questionNumber });
            if (question) {
                const isCorrect = answer.answer === question.correctAnswer;
                const points = isCorrect ? 10 : 0;
                const finalResult = new FinalResult({
                    studentId,
                    questionNumber: answer.questionNumber,
                    answer: answer.answer,
                    correctAnswer: question.correctAnswer,
                    points
                });
                await finalResult.save();
                results.push(finalResult); // Save the entire finalResult object for easy access later
            }
        }
        res.status(200).json({ message: 'Final results calculated successfully', results });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating final results', error });
    }
});
// Endpoint to update polling data
app.post('/api/updatePolling', async (req, res) => {
    const { questionId, answer, points } = req.body;
    try {
        // Find the answer record and update the points
        const answerRecord = await Answer.findOneAndUpdate(
            { questionId, answer },
            { $inc: { points: points } },
            { new: true, upsert: true } // Create if not exists
        );
        res.status(200).json({ message: 'Polling updated successfully', answerRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error updating polling data', error });
    }
});
// Endpoint to get all candidates
app.get('/api/getCandidates', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'studentName'); // Only fetch the studentName field
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching candidates', error });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});