import { useEffect, useReducer } from 'react';

// Components
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Questions from './components/Questions';
import NextButton from './components/NextButton';

const initialState = {
  questions: [],
  // Status: loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DATA_SUCCESS':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'DATA_ERROR':
      return { ...state, status: 'error' };
    case 'START':
      return { ...state, status: 'active' };
    case 'SUBMIT_ANSWER':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'NEXT_QUESTION':
      return { ...state, index: state.index + 1, answer: null };
    default:
      return state;
  }
}

export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;

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
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton answer={answer} dispatch={dispatch} />
          </>
        )}
      </Main>
    </div>
  );
}
