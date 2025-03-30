import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Import useNavigate
const RegisterCandidates = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState(''); // Changed srn to studentId
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to the backend
            const response = await axios.post('http://localhost:5000/api/registerCandidate', {
                studentName,
                email,
                studentId // Use studentId instead of srn
            });
            console.log("Response:", response.data);
            alert("Student Registered Successfully!");
            // Clear the form
            setStudentName('');
            setEmail('');
            setStudentId(''); // Clear studentId
        } catch (error) {
            console.error("Error registering student:", error);
            alert("Email is already registered.");
        }
    };
    return (
        <div style={styles.outerContainer}>
            <button onClick={() => navigate('/components/teacherdashboard')} style={styles.backButton}>Back</button>
            <h1 style={styles.heading}>Register Candidates</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="studentName" style={styles.label}>Student Name:</label>
                    <input 
                        type="text" 
                        id="studentName" 
                        value={studentName} 
                        onChange={(e) => setStudentName(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
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
                    <label htmlFor="studentId" style={styles.label}>Student ID:</label>
                    <input 
                        type="text" 
                        id="studentId" 
                        value={studentId} 
                        onChange={(e) => setStudentId(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Register</button>
            </form>
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
        backgroundImage: "url('https://cdn.pixabay.com/photo/2019/02/20/19/51/question-mark-4009913_960_720.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
        margin: "0 auto",
        color: "black",
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: '10px 15px',
        marginBottom: '20px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#FF5722',
        color: 'white',
        fontSize: '14px',
        cursor: 'pointer',
    },
    heading: {
        color: "white", // Change heading color to white
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
    label: {
        color: "white", // Change label color to white
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
    },
};
export default RegisterCandidates;