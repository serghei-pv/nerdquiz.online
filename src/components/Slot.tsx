import styles from "../styles/create.module.css";

function Slot({ slot, question, answer }: any): React.ReactElement {
  return (
    <div className={styles.slot}>
      <div>Question {slot + 1}:</div>
      <textarea className={styles.question} name="question" defaultValue={question}></textarea>
      <span className={styles.span}>Answer:</span>
      <textarea className={styles.answer} name="answer" defaultValue={answer}></textarea>
    </div>
  );
}

export default Slot;
