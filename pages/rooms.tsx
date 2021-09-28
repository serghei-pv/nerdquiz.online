import HeadContainer from "../components/Head";
import styles from "../styles/rooms.module.css";

const Rooms = ({ quizzes }: any) => {
  let counter = quizzes.length;
  return (
    <>
      <HeadContainer>Rooms</HeadContainer>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.number}>#</th>
            <th className={styles.id}>ID</th>
            <th className={styles.amount}>Questions</th>
            <th className={styles.user}>Submitter</th>
          </tr>
        </thead>
        {quizzes
          .slice(0)
          .reverse()
          .map((quiz: any) => (
            <tbody key={quiz._id} className={styles.tbody}>
              <tr>
                <td className={styles.number}>{counter--}</td>
                <td className={styles.id}>{quiz._id}</td>
                <td className={styles.amount}>{quiz.question.length}</td>
                <td className={styles.user}>{quiz.username}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </>
  );
};

export async function getStaticProps() {
  let res: Response = await fetch("http://localhost:8100/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Tim",
    }),
  });
  let quizzes = await res.json();

  return {
    props: { quizzes },
  };
}

export default Rooms;
