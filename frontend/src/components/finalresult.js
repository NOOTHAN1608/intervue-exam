import React, { useEffect, useState } from "react";
import axios from 'axios';
const FinalView = ({ quizName }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [pollingData, setPollingData] = useState({});
    const [optionPercentages, setOptionPercentages] = useState({});
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [participantsVisible, setParticipantsVisible] = useState(false);
    const [participants, setParticipants] = useState([]); // State to hold participant names
    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:10000/api/getQuestions');
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
            alert("Error fetching questions. Please try again.");
        }
    };
    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:10000/api/getCandidates');
            setParticipants(response.data.map(candidate => candidate.studentName)); // Map to get student names
        } catch (error) {
            console.error("Error fetching candidates:", error);
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
        fetchCandidates(); // Fetch candidates when the component mounts
    }, []);
    useEffect(() => {
        if (questions.length > 0) {
            fetchPollingData(questions[currentQuestionIndex]._id);
        }
    }, [currentQuestionIndex, questions]);
    const handleAnswerChange = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        const currentPercentages = optionPercentages[currentQuestion._id] || {};
        const totalPercentage = Object.values(currentPercentages).reduce((acc, val) => acc + val, 0);
        let remainingPercentage = 100 - totalPercentage;
        setAnswers((prevAnswers) => {
            const currentAnswers = prevAnswers[currentQuestion._id] || [];
            if (currentAnswers.includes(selectedOption)) {
                return {
                    ...prevAnswers,
                    [currentQuestion._id]: currentAnswers.filter(answer => answer !== selectedOption),
                };
            } else {
                const randomPercentage = Math.floor(Math.random() * (remainingPercentage + 1));
                setOptionPercentages((prev) => ({
                    ...prev,
                    [currentQuestion._id]: {
                        ...prev[currentQuestion._id],
                        [selectedOption]: randomPercentage
                    }
                }));
                return {
                    ...prevAnswers,
                    [currentQuestion._id]: [...currentAnswers, selectedOption],
                };
            }
        });
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
    const handleUserMessage = (e) => {
        setUserMessage(e.target.value);
    };
    const handleSendMessage = () => {
        if (userMessage.trim() === '') return;
        setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        const response = getResponse(userMessage);
        if (response) {
            setChatMessages(prev => [...prev, { sender: 'bot', text: response }]);
        } else {
            setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, I don't understand that." }]);
        }
        setUserMessage('');
    };
    const getResponse = (message) => {
        const lowercasedMessage = message.toLowerCase();
        const responses = {
            "hello": "Hi there! How can I help you?",
            "hi": "Hello! What can I assist you with today?",
            "hey": "Hey! How can I help you today?",
            "name": "I'm a chatbot created to assist you.",
            "how": "I'm just a program, but thanks for asking!",
            "what": "I can help you with questions about this quiz, provide tips, and assist with exam-related queries.",
            "quiz": "This quiz covers various topics. You can check the questions to see what subjects are included.",
            "number": "There are a total of [insert number] questions in this quiz.",
            "review": "Yes, you can review your answers after completing the quiz.",
            "time": "If you run out of time, your quiz will be submitted automatically.",
            "retake": "Yes, you can retake the quiz as many times as you want.",
            "submit": "You can submit your answers by clicking the 'Submit' button at the end of the quiz.",
            "passing": "The passing score for this quiz is [insert score].",
            "feedback": "Yes, you will receive feedback after completing the quiz.",
            "bye": "Goodbye! Have a great day!",
            "thanks": "You're welcome! If you have any more questions, feel free to ask.",
            "study": "Sure! I can provide tips and resources to help you study.",
            "start": "The quiz starts when you click the 'Start' button.",
            "duration": "The quiz duration is [insert duration]. Make sure to manage your time well!",
            "difficulty": "The quiz has varying difficulty levels. You can check the questions to see what to expect.",
            "help": "I'm here to help! What do you need assistance with?",
            "resources": "I can suggest study materials and resources. What subject are you studying?",
            "score": "Your score will be calculated at the end of the quiz.",
            "timer": "A timer will be displayed on the screen to keep track of your remaining time.",
            "rules": "Please follow the quiz rules: no cheating, and stay focused!",
            "change": "You can change your answers before submitting the quiz.",
            "contact": "For further assistance, please contact support at [insert contact info].",
            "updates": "Stay tuned for updates regarding new quizzes and features!",
            "schedule": "You can find the quiz schedule in the main menu.",
            "practice": "Practice makes perfect! Would you like some practice questions?",
            "clarify": "Feel free to ask for clarification on any question in the quiz."
        };
        return responses[lowercasedMessage] || null;
    };
    const toggleParticipantsVisibility = () => {
        setParticipantsVisible(!participantsVisible);
    };
    if (questions.length === 0) return <div>Loading questions...</div>;
    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div style={styles.outerContainer}>
            <h1>{quizName}</h1>
            <div style={styles.questionContainer}>
                <h2>{currentQuestion.question}</h2>
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options.map((option, index) => {
                    const percentage = optionPercentages[currentQuestion._id]?.[option] || 0;
                    return (
                        <div
                            key={index}
                            style={{
                                ...styles.optionCard,
                                backgroundColor: `rgba(25, 118, 210, ${percentage / 100})`,
                                color: answers[currentQuestion._id]?.includes(option) ? 'white' : 'black',
                            }}
                            onClick={() => handleAnswerChange(option)}
                        >
                            {option}
                            <span style={styles.pollingPercentage}>
                                {` (${percentage}%)`}
                            </span>
                        </div>
                    );
                })}
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
                <button type="button" onClick={handleNext} style={styles.button} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                </button>
            </div>
            {/* Chatbot Icon */}
            <div style={styles.chatbotIcon} onClick={() => setChatbotVisible(!chatbotVisible)}>
                <img src="https://cdn.pixabay.com/photo/2021/11/24/05/16/bubble-6820224_1280.png" alt="Chatbot" style={styles.chatbotImage} />
            </div>
            {/* Participants Icon */}
            <div style={styles.participantsIcon} onClick={toggleParticipantsVisibility}>
                <img src="https://i.pinimg.com/originals/f0/7a/ec/f07aecdfa05ec45dfec39e17cc9126e1.png" alt="Participants" style={styles.participantsImage} />
            </div>
            {/* Chatbot Component */}
            {chatbotVisible && (
                <div style={styles.chatbotContainer}>
                    <h3>Chatbot</h3>
                    <div style={styles.chatMessages}>
                        {chatMessages.map((message, index) => (
                            <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                                <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong> {message.text}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        style={styles.chatInput}
                        value={userMessage}
                        onChange={handleUserMessage}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
                </div>
            )}
            {/* Participants List */}
            {participantsVisible && (
                <div style={styles.participantsContainer}>
                    <h3>Participants</h3>
                    <ul>
                        {participants.map((participant, index) => (
                            <li key={index}>{participant}</li>
                        ))}
                    </ul>
                </div>
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
        height: "100vh",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
        margin: "0 auto",
        color: "black",
    },
    questionContainer: {
        marginBottom: "20px",
        border: "1px solid rgba(255, 3, 3, 0.65)",
        borderRadius: "4px",
        padding: "10px",
        width: "100%",
    },
    optionCard: {
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px",
        cursor: "pointer",
        textAlign: "center",
        transition: "background-color 0.3s, color 0.3s",
        border: "1px solid #2196F3",
    },
    pollingPercentage: {
        marginLeft: "10px",
        fontWeight: "bold",
        color: "green",
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
        width: "100%",
    },
    chatbotIcon: {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        cursor: "pointer",
    },
    chatbotImage: {
        width: "50px",
        height: "50px",
    },
    participantsIcon: {
        position: "fixed",
        bottom: "140px",
        right: "20px",
        cursor: "pointer",
    },
    participantsImage: {
        width: "50px",
        height: "50px",
    },
    chatbotContainer: {
        position: "fixed",
        bottom: "210px",
        right: "20px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        width: "300px",
        zIndex: 1000,
    },
    chatMessages: {
        maxHeight: "200px",
        overflowY: "auto",
        marginBottom: "10px",
    },
    chatInput: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #2196F3",
    },
    sendButton: {
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#1976D2",
        color: "white",
        cursor: "pointer",
        marginTop: "5px",
    },
    participantsContainer: {
        position: "fixed",
        bottom: "210px",
        right: "20px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        width: "200px",
        zIndex: 1000,
    },
};
export default FinalView;