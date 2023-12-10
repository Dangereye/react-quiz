export default function FinishScreen({ points, maxPoints, highscore }) {
  const percentage = (points / maxPoints) * 100;
  return (
    <>
      <p className='result'>
        You scored <strong>{points}</strong> out of {maxPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className='highscore'>
        Hightscore: <strong>{highscore}</strong> points
      </p>
    </>
  );
}
