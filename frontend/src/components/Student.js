// client/src/components/Student.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io('https://livepolling-exam-backend.onrender.com');
const Student = () => {
    const [name, setName] = useState('');
    const [poll, setPoll] = useState(null);
    const [response, setResponse] = useState('');
    useEffect(() => {
        socket.on('pollCreated', (newPoll) => {
            setPoll(newPoll);
        });
        socket.on('answerSubmitted', (answer) => {
            // Handle answer submission
        });
        return () => {
            socket.off('pollCreated');
            socket.off('answerSubmitted');
        };
    }, []);
    const submitAnswer = () => {
        socket.emit('submitAnswer', { studentName: name, answer: response });
        setResponse('');
    };
    return (
        <div>
            <h2>Student</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {poll && (
                <div>
                    <h3>{poll.question}</h3>
                    {poll.options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                value={option}
                                onChange={(e) => setResponse(e.target.value)}
                            />
                            {option}
                        </div>
                    ))}
                    <button onClick={submitAnswer}>Submit Answer</button>
                </div>
            )}
        </div>
    );
};
export default Student;