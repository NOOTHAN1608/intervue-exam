import React, { useEffect, useState } from "react";
import axios from 'axios';
const StudentDashboard = ({ quizName }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [loading, setLoading] = useState(false);
    const [pollingData, setPollingData] = useState({});
    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:10000/api/getQuestions');
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
            alert("Error fetching questions. Please try again.");
        }
    };
    const fetchPollingData = async (questionId) => {
        try {
            const response = await axios.get(`/api/getPollingData/${questionId}`);
            setPollingData(prev => ({ ...prev, [questionId]: response.data }));
        } catch (error) {
            console.error("Error fetching polling data:", error);
        }
    };
    useEffect(() => {
        fetchQuestions();
    }, []);
    useEffect(() => {
        if (questions.length > 0) {
            fetchPollingData(questions[currentQuestionIndex]._id);
        }
    }, [currentQuestionIndex, questions]);
    const verifyStudentId = async () => {
        try {
            const response = await axios.get(`http://localhost:10000/api/verifyStudentId/${studentId}`);
            return response.data; 
        } catch (error) {
            console.error("Error verifying Student ID:", error);
            alert("Error verifying Student ID. Please try again.");
            return { exists: false, hasStartedTest: false };
        }
    };
    const startTest = async () => {
        const isValidId = await verifyStudentId();
        if (!isValidId.exists) {
            alert("Please enter a valid Student ID.");
            return;
        }
        if (isValidId.hasStartedTest) {
            alert("You have already started the test. You cannot start again.");
            return;
        }
        try {
            await axios.patch(`http://localhost:10000/api/updateTestStatus`, { studentId });
        } catch (error) {
            console.error("Error updating test status:", error);
            alert("Error starting the test. Please try again.");
            return;
        }
        setTestStarted(true);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setTimeLeft(1 * 60);
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setIsTimeUp(true);
                        alert("Time is up! The test has ended.");
                        window.location.href = '/'; 
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }, 1000);
    };
    const handleAnswerChange = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestion._id]: selectedOption,
        }));
    };
    const handleSaveAndNext = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!answers[currentQuestion._id]) {
            alert("Please select an answer before proceeding.");
            return; 
        }
        try {
            await axios.post('http://localhost:10000/api/saveAnswer', {
                studentId,
                questionId: currentQuestion._id,
                questionNumber: currentQuestion.questionNumber,
                answer: answers[currentQuestion._id],
            });
            // Update polling data by adding 5 points for the selected answer
            await axios.post('http://localhost:10000/api/updatePolling', {
                questionId: currentQuestion._id,
                answer: answers[currentQuestion._id],
                points: 5
            });
            handleNext();
        } catch (error) {
            console.error("Error saving answer:", error);
            alert("Error saving answer. Please try again.");
        }
    };
    const handleSubmitAnswers = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:10000/api/submitAnswers', { studentId, answers });
            alert("Answers submitted successfully!");
            window.location.href = '/'; 
        } catch (error) {
            console.error("Error submitting answers:", error);
            alert("Error submitting answers. Please try again.");
        }
    };
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    if (isTimeUp) {
        return (
            <div style={styles.outerContainer}>
                <h1>Time is up! The test has ended.</h1>
                <button onClick={() => window.location.href = '/'} style={styles.button}>Go to Home</button>
            </div>
        );
    }
    if (loading) {
        return (
            <div style={styles.outerContainer}>
                <h1>Loading questions, please wait...</h1>
            </div>
        );
    }
    if (questions.length === 0) return <div>Loading questions...</div>;
    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div style={{ ...styles.outerContainer, backgroundColor: timeLeft <= 10 ? 'red' : '#E0F7FA' }}>
            <h1>{quizName}</h1>
            {!testStarted ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Student ID"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={startTest} style={styles.button}>Start Test</button>
                </div>
            ) : (
                <>
                    <h2>Time Left: {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}` : "Loading..."}</h2>
                    <div style={styles.questionInfo}>
                        <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
                    </div>
                    <form onSubmit={handleSubmitAnswers} style={styles.form}>
                        <div style={styles.questionContainer}>
                            <h2>{currentQuestion.question}</h2>
                            {currentQuestion.type === 'multiple-choice' && currentQuestion.options.map((option, index) => (
                                <div key={index} style={styles.inputGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={currentQuestion._id}
                                            value={option}
                                            checked={answers[currentQuestion._id] === option}
                                            onChange={() => handleAnswerChange(option)}
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                            {currentQuestion.type === 'fill-in-the-blank' && (
                                <input
                                    type="text"
                                    placeholder="Your answer"
                                    style={styles.input}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                />
                            )}
                        </div>
                        <div style={styles.buttonContainer}>
                            <button type="button" onClick={handlePrevious} style={styles.button} disabled={currentQuestionIndex === 0}>
                                Previous
                            </button>
                            <button type="button" onClick={handleSaveAndNext} style={styles.button} disabled={currentQuestionIndex === questions.length - 1}>
                                Save and Next
                            </button>
                        </div>
                        {currentQuestionIndex === questions.length - 1 && (
                            <button type="submit" style={styles.button}>Submit Answers</button>
                        )}
                    </form>
                </>
            )}
        </div>
    );
};
const styles = {
    outerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
        margin: "0 auto",
        color: "black",
    },
    questionInfo: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
    },
    questionContainer: {
        marginBottom: "20px",
        border: "1px solid rgba(255, 3, 3, 0.65)",
        borderRadius: "4px",
        padding: "10px",
    },
    inputGroup: {
        marginBottom: "10px",
    },
    input: {
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #2196F3",
        fontSize: "16px",
        marginBottom: "20px",
        width: "100%",
    },
    button: {
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#1976D2",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
};
export default StudentDashboard;