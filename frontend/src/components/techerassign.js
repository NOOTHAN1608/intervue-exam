import React from 'react';
const TeacherAssigning = () => {
    const handleLeftCardClick = () => {
        window.location.href = '/components/addQuestionnaires'; // Navigate to this URL when left card is clicked
    };
    const handleRightCardClick = () => {
        window.location.href = '/components/finalresult'; 
    };
    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={styles.title}>Quiz Management</h1>
                <div style={styles.cardContainer}>
                    <div style={styles.leftCard} onClick={handleLeftCardClick}>
                        <h2 style={styles.cardTitle}>New Quiz</h2>
                        <p style={styles.cardText}>Start a new quiz </p>
                    </div>
                    <div style={styles.rightCard} onClick={handleRightCardClick}>
                        <h2 style={styles.cardTitle}>Result  Quiz</h2>
                        <p style={styles.cardText}>Review student  result poll</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const styles = {
    background: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: '#f0f0f0', 
        color: '#333',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center',
        backgroundColor: '#ffffff', // Background color for the container
        border: '2px solid #4CAF50', // Green border
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    title: {
        marginBottom: '30px',
        fontSize: '2em',
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px', // Gap between cards
        width: '80%', // Adjust width as needed
    },
    leftCard: {
        backgroundColor: 'green', // Green card background
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        width: '250px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        color: 'white',
    },
    rightCard: {
        backgroundColor: 'red', // Red card background
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        width: '250px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        color: 'white',
    },
    cardTitle: {
        margin: 0,
    },
    cardText: {
        margin: '10px 0 0',
    },
};
export default TeacherAssigning;