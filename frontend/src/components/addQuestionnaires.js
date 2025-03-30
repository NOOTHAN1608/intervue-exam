import React, { useState } from "react";
import axios from 'axios'; 
const AddQuestion = ({ onQuestionAdded }) => {
    const [quizName, setQuizName] = useState('');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [isFillInTheBlank, setIsFillInTheBlank] = useState(false);
    const handleQuizNameSubmit = async (e) => {
        e.preventDefault();
        try {
            
            await axios.post('http://localhost:5000/api/createQuiz', { quizName });
            setShowQuestionForm(true); 
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Error creating quiz. Please try again.");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const questionData = isFillInTheBlank
            ? { question, type: 'fill-in-the-blank', correctAnswer, quizName }
            : { question, options: [option1, option2, option3, option4], type: 'multiple-choice', correctAnswer, quizName };
        try {
            const response = await axios.post('http://localhost:5000/api/addQuestion', questionData);
            console.log("Response:", response.data);
            alert("Question added successfully!");
            resetForm();
            onQuestionAdded(); 
        } catch (error) {
            console.error("Error adding question:", error);
            alert("Error adding question. Please try again.");
        }
    };
    const resetForm = () => {
        setQuestion('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
        setCorrectAnswer(''); 
    };
    const handleViewResults = () => {
        alert("Viewing results for the quiz: " + quizName);
        // Here you can implement the actual logic to view results
    };
    return (
        <div style={styles.outerContainer}>
            {!showQuestionForm ? (
                <>
                    <h1>Enter Quiz Name</h1>
                    <form onSubmit={handleQuizNameSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="quizName">Quiz Name:</label>
                            <input 
                                type="text" 
                                id="quizName" 
                                value={quizName} 
                                onChange={(e) => setQuizName(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>Create Quiz Name</button>
                    </form>
                </>
            ) : (
                <>
                    <h1>Add Question</h1>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="question">Question:</label>
                            <input 
                                type="text" 
                                id="question" 
                                value={question} 
                                onChange={(e) => setQuestion(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={isFillInTheBlank} 
                                    onChange={() => setIsFillInTheBlank(!isFillInTheBlank)} 
                                />
                                Fill in the blank
                            </label>
                        </div>
                        {!isFillInTheBlank && (
                            <>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="option1">Option 1:</label>
                                    <input 
                                        type="text" 
                                        id="option1" 
                                        value={option1} 
                                        onChange={(e) => setOption1(e.target.value)} 
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="option2">Option 2:</label>
                                    <input 
                                        type="text" 
                                        id="option2" 
                                        value={option2} 
                                        onChange={(e) => setOption2(e.target.value)} 
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="option3">Option 3:</label>
                                    <input 
                                        type="text" 
                                        id="option3" 
                                        value={option3} 
                                        onChange={(e) => setOption3(e.target.value)} 
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="option4">Option 4:</label>
                                    <input 
                                        type="text" 
                                        id="option4" 
                                        value={option4} 
                                        onChange={(e) => setOption4(e.target.value)} 
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                            </>
                        )}
                        <div style={styles.inputGroup}>
                            <label htmlFor="correctAnswer">Correct Answer:</label>
                            <input 
                                type="text" 
                                id="correctAnswer" 
                                value={correctAnswer} 
                                onChange={(e) => setCorrectAnswer(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>Add Question</button>
                        
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
        backgroundColor: "#E0F7FA",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
        margin: "0 auto",
        color: "black",
    },
    form: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #2196F3",
        fontSize: "16px",
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
        marginTop: "10px", 
    },
};
export default AddQuestion;