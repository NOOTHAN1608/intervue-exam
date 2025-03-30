// client/src/components/Teacher.js
import React, { useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
const Teacher = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const createPoll = () => {
        const poll = { question, options };
        socket.emit('createPoll', poll);
        setQuestion('');
        setOptions([]);
    };
    return (
        <div>
            <h2>Teacher</h2>
            <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={createPoll}>Create Poll</button>
        </div>
    );
};
export default Teacher;