import styles from "../src//styles/rooms.module.css";
import HeadContainer from "../src/components/Head";
import Link from "next/link";

function Rooms({ quizzes }: any): React.ReactElement {
  return (
    <>
      <HeadContainer>Rooms</HeadContainer>
      <div className={styles.fixed}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.id_th}>Quiz number</th>
              <th className={styles.user_th}>Submitter</th>
              <th className={styles.amount_th}>Questions</th>
            </tr>
          </thead>
          {quizzes
            .slice(0)
            .reverse()
            .map((quiz: any) => (
              <Link key={quiz._id} href={"/quiz/" + quiz._id} passHref>
                <tbody className={styles.tbody}>
                  <tr>
                    <td className={styles.id}>{quiz._id}</td>
                    <td className={styles.user}>{quiz.username}</td>
                    <td className={styles.amount}>{quiz.question.length}</td>
                  </tr>
                </tbody>
              </Link>
            ))}
        </table>
      </div>
    </>
  );
}

export async function getServerSideProps(): Promise<any> {
  const res: Response = await fetch("http://localhost:8100/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();

  return {
    props: { quizzes: data },
  };
}

export default Rooms;
