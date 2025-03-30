// src/redux/store.js
import { createStore } from 'redux';
const initialState = {
    polls: [],
    results: [],
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_POLL':
            return { ...state, polls: [...state.polls, action.payload] };
        case 'ADD_RESULT':
            return { ...state, results: [...state.results, action.payload] };
        default:
            return state;
    }
};
const store = createStore(reducer);
export default store;