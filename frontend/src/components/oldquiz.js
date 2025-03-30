import React, { useEffect, useState } from 'react';
import axios from 'axios';
const OldQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/quizzes'); // Fetch quizzes from the backend
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
            await axios.delete(`http://localhost:5000/api/deleteQuiz/${id}`); // Call delete endpoint
            setQuizzes(quizzes.filter(quiz => quiz._id !== id)); // Update state to remove the deleted quiz
        } catch (err) {
            setError('Error deleting quiz');
        }
    };
    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    return (
        <div style={styles.quizzesContainer}>
            {quizzes.map((quiz) => (
                <div style={styles.quizCard} key={quiz._id}>
                    <h3 style={styles.quizTitle}>{quiz.name}</h3>
                    <div style={styles.buttonContainer}>
                        <button 
                            style={styles.takeQuizButton} 
                            onClick={() => alert(`Viewing results for: ${quiz.name}`)}
                        >
                            View Results
                        </button>
                        <button 
                            style={styles.deleteButton} 
                            onClick={() => handleDelete(quiz._id)} // Call delete handler
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
// Internal CSS styles
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
    },
    quizTitle: {
        margin: '10px 0',
        fontSize: '18px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center', // Center the buttons
        marginTop: '10px',
    },
    takeQuizButton: {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '5px', // Add margin between buttons
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
};
export default OldQuiz;