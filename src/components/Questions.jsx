// Components
import Options from './Options';

export default function Questions({ question }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}
