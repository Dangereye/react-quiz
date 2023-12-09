export default function NextButton({ answer, dispatch }) {
  if (answer === null) return null;
  return (
    <button
      className='btn btn-ui'
      onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
    >
      Next
    </button>
  );
}
