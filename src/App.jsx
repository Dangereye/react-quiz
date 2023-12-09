import { useEffect, useReducer } from 'react';

// Components
import Header from './components/Header';
import Main from './components/Main';

const initialState = {
  questions: [],
  // Status: loading, error, ready,active,finished
  status: 'loading',
};

function reducer(state, action) {
  switch (action.type) {
    case 'DATA_SUCCESS':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'DATA_ERROR':
      return { ...state, status: 'error' };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(function () {
    async function getQuestions() {
      try {
        const res = await fetch('http://localhost:8000/questions');
        if (!res.ok) throw new Error('Oops! Something went wrong.');
        const data = await res.json();
        dispatch({ type: 'DATA_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'DATA_ERROR' });
      } finally {
      }
    }
    getQuestions();
  }, []);

  return (
    <div className='app'>
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}
