import React from "react";
import { useNavigate } from "react-router-dom";
const TeacherDashboard = () => {
    const navigate = useNavigate();
    const handleCardClick = (action) => {
        if (action === "RegisterCandidates") {
            navigate("/components/registerCandidates"); 
        } else if (action === "AddQuestionnaires") {
            navigate("/components/techerassign");   
            
        }
        
        

    
    
    
        
    };
    return (
        <div style={styles.outerContainer}>
           
            <div style={styles.marquee}>
            
                <p> Manage your polls effectively! </p>
            </div>
            
            
            <img 
                src="https://cdn.pixabay.com/photo/2017/06/21/18/44/exam-2428208_960_720.png" 
                alt="Teacher Dashboard"
                style={styles.image}
            />
            
            <div style={styles.container}>
                <div style={styles.cardContainer}>
                <button onClick={() => navigate('/components/teacherlogin')} style={styles.backButton}>
                BACK
            </button>
                    <div 
                        style={{ ...styles.card, ...styles.candidateCard }} 
                        onClick={() => handleCardClick("RegisterCandidates")}
                    >
                        <h2>Register Candidates</h2>
                        <p>Click here to register candidates for the polls.</p>
                    </div>
                    <div 
                        style={{ ...styles.card, ...styles.questionnaireCard }} 
                        onClick={() => handleCardClick("AddQuestionnaires")}
                    >
                        <h2>Add Questionnaires</h2>
                        <p>Click here to add questionnaires for the polls.</p>
                        
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
        backgroundColor: "#E0F7FA", // Light cyan background color
        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/002/130/418/original/online-exam-education-illustration-web-school-test-isolated-concept-laptop-screen-check-boxes-list-internet-distance-quiz-questionnaire-poll-design-online-exam-digital-survey-book-vector.jpg')", // Background image URL
        backgroundSize: "cover", // Cover the entire container
        backgroundPosition: "center", // Center the background image
        maxWidth: "800px",
        margin: "0 auto",
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: '10px 15px',
        marginBottom: '20px', // Space between button and content
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#FF5722',
        color: 'white',
        fontSize: '14px',
        cursor: 'pointer',
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
    candidateCard: {
        border: "2px solid #4CAF50", // Green border for candidate card
    },
    questionnaireCard: {
        border: "2px solid #2196F3", // Blue border for questionnaire card
    },
    image: {
        width: "100%",
        maxWidth: "300px",
        marginBottom: "20px",
    },
};
export default TeacherDashboard;