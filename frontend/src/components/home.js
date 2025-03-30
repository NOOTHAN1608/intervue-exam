import React from "react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
    
    const handleCardClick = (role) => {
        if (role === "Student") {
            navigate("/components/studentlogin"); // Navigate to Student Login page
        } else if (role === "Teacher") {
            navigate("/components/teacherlogin"); // Navigate to Teacher Login page
        }
    };
    return (
        <div style={styles.outerContainer}>
            <div style={styles.marquee}>
                <p> Participate and share your thoughts. All the best!...</p>
            </div>
            <div style={styles.container}>
                <img 
                    src="https://cdn.pixabay.com/photo/2017/06/21/18/44/exam-2428208_960_720.png" 
                    alt="Live Polling"
                    style={styles.image}
                />
                <div style={styles.welcomeMessage}>
                    <h1>Welcome to the Live Polling System</h1>
                    <p>Please select your role to proceed.</p>
                </div>
                <div style={styles.cardContainer}>
                    <div 
                        style={{ ...styles.card, ...styles.studentCard }} 
                        onClick={() => handleCardClick("Student")}
                    >
                        <h2>I am a Student</h2>
                        <p>Click here to participate in polls as a student.</p>
                    </div>
                    <div 
                        style={{ ...styles.card, ...styles.teacherCard }} 
                        onClick={() => handleCardClick("Teacher")}
                    >
                        <h2>I am a Teacher</h2>
                        <p>Click here to create and manage polls.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const styles = {
    outerContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        border: "2px solid black",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        maxWidth: "800px",
        margin: "0 auto",
    },
    marquee: {
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        backgroundColor: "#ffeb3b",
        padding: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "center",
        animation: "marquee 10s linear infinite",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "200px",
        maxWidth: "300px",
        height: "100px",
        marginBottom: "20px",
    },
    welcomeMessage: {
        textAlign: "center",
        marginBottom: "20px",
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        margin: "20px",
        padding: "20px",
        textAlign: "center",
        transition: "transform 0.2s",
        cursor: "pointer",
        width: "250px",
    },
    studentCard: {
        border: "2px solid #4CAF50",
    },
    teacherCard: {
        border: "2px solid #2196F3",
    },
};
export default HomePage;