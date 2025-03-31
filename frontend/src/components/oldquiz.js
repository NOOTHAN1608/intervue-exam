import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const OldQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/quizzes');
                setQuizzes(response.data);
            } catch (err) {
                setError('Error fetching quizzes');
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:10000/api/deleteQuiz/${id}`);
            setQuizzes(quizzes.filter(quiz => quiz._id !== id));
        } catch (err) {
            setError('Error deleting quiz');
        }
    };
    const viewResults = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:10000/api/getQuizResults/${quizId}`);
            setResults(response.data);
            navigate('/components/finalresult');
        } catch (err) {
            setError('Error fetching quiz results');
        }
    };
    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    return (
        <div style={styles.quizzesContainer}>
            {quizzes.map((quiz) => (
                <div 
                    style={styles.quizCard} 
                    key={quiz._id} 
                    onClick={() => viewResults(quiz._id)} // Navigate on card click
                >
                    <h3 style={styles.quizTitle}>{quiz.name}</h3>
                    <div style={styles.buttonContainer}>
                        <button 
                            style={styles.deleteButton} 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click event
                                handleDelete(quiz._id);
                            }}
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
            {results.length > 0 && (
                <div style={styles.resultsContainer}>
                    <h4>Results:</h4>
                    <ul>
                        {results.map((result) => (
                            <li key={result.studentId}>
                                Student ID: {result.studentId}, Correct Answers: {result.percentage.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
const styles = {
    quizzesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: '20px',
    },
    quizCard: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        width: '200px',
        textAlign: 'center',
        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer', // Change cursor to pointer
    },
    quizTitle: {
        margin: '10px 0',
        fontSize: '18px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
    },
    loading: {
        textAlign: 'center',
        fontSize: '20px',
        marginTop: '20px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '20px',
    },
    resultsContainer: {
        marginTop: '20px',
    },
};
export default OldQuiz;