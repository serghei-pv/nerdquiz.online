import styles from "../styles/rooms.module.css";
import HeadContainer from "./components/Head";
import Link from "next/link";

const Rooms = ({ quizzes }: any) => {
  let counter = quizzes.length;
  return (
    <>
      <HeadContainer>Rooms</HeadContainer>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.number_th}>#</th>
            <th className={styles.id_th}>ID</th>
            <th className={styles.amount_th}>Questions</th>
            <th className={styles.user_th}>Submitter</th>
          </tr>
        </thead>
        {quizzes
          .slice(0)
          .reverse()
          .map((quiz: any) => (
            <tbody key={quiz._id} className={styles.tbody}>
              <tr>
                <td className={styles.number}>{counter--}</td>
                <td className={styles.id}>
                  <Link href={"/quiz/" + quiz._id}>
                    <a>{quiz._id}</a>
                  </Link>
                </td>
                <td className={styles.amount}>{quiz.question.length}</td>
                <td className={styles.user}>{quiz.username}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </>
  );
};

export async function getServerSideProps() {
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
