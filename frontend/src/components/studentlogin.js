import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            setShowForm(true);
        }, 300);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        navigate('/components/studentdashboard');
    };
    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/')} style={styles.backButton}>Back</button>
            <div style={styles.contentContainer}>
                <div style={styles.instructionContainer}>
                    <h2>Instructions</h2>
                    <p>Welcome to the student login portal. Please follow the steps below:</p>
                    <ul>
                        <li>Enter your registered email address and password.</li>
                        <li>Ensure your password matches the confirmation field.</li>
                        <li>If you don’t have an login,contact your mentors </li>
                        <li>Once logged in, you can participate in polls and view results.</li>
                        <li>Make sure your internet connection is stable before logging in.</li>
                    </ul>
                </div>
                {showForm && (
                    <div style={styles.formContainer} className="slideIn">
                        <h2>Student Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.inputGroup}>
                                <label htmlFor="email">Email:</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label htmlFor="password">Password:</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    style={styles.input}
                                />
                            </div>
                            <button type="submit" style={styles.button}>Login</button>
                        </form>
                    </div>
                )}
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            transform: translateY(-100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    .slideIn {
                        animation: slideIn 1s ease-in-out;
                    }
                `}
            </style>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#E3F2FD',
        padding: '20px',
        boxSizing: 'border-box',
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: '10px 15px',
        marginBottom: '10px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#FF5722',
        color: 'white',
        fontSize: '14px',
        cursor: 'pointer',
    },
    contentContainer: {
        display: 'flex',
        width: '80%',
        justifyContent: 'space-between',
        alignItems: 'stretch', // Ensures both columns stretch to the same height
    },
    instructionContainer: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginRight: '20px', // Adds spacing between the two sections
    },
    formContainer: {
        flex: 1,
        padding: '30px',
        backgroundColor: '#FFF',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        border: '2px solid #2196F3',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #2196F3',
        backgroundColor: '#E3F2FD',
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#1976D2',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    }
};
export default StudentLogin;