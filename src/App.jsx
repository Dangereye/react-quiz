import { useEffect, useReducer } from 'react';

// Components
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Questions from './components/Questions';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Timer from './components/Timer';
import Footer from './components/Footer';

const secsPerQuestion = 30;

const initialState = {
  questions: [],
  // Status: loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DATA_SUCCESS':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'DATA_ERROR':
      return { ...state, status: 'error' };
    case 'START':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * secsPerQuestion,
      };
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
    case 'FINISHED':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'RESTART':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: null,
      };
    case 'TICKTOCK':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      return state;
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                index={index}
                numQuestions={numQuestions}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
