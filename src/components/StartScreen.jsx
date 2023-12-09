export default function StartScreen({ numQuestions, dispatch }) {
  return (
    <div classname='start'>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'START' })}
      >
        Let's start
      </button>
    </div>
  );
}