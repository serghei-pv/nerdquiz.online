import styles from "../styles/table.module.css";
import Link from "next/link";

function Table({ type, props }: any): React.ReactElement {
  if (type == "topList") {
    props.sort((a: { wins: number; losses: number }, b: { wins: number; losses: number }) => {
      return b.wins - a.wins || a.losses - b.losses;
    });
  }
  return (
    <div className={styles.fixed}>
      {type == "quizTable" && (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.id_th}>Quiz number</th>
              <th className={styles.user_th}>Submitter</th>
              <th className={styles.amount_th}>Questions</th>
            </tr>
          </thead>
          {props
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
      )}
      {type == "topList" && (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.user_th}>Username</th>
              <th className={styles.lossWins_th}>Wins</th>
              <th className={styles.lossWins_th}>Losses</th>
            </tr>
          </thead>
          {props.map((user: any) => (
            <tbody key={user.username} className={styles.tbody}>
              <tr>
                <td className={styles.user}>{user.username}</td>
                <td className={styles.lossWins}>{user.wins}</td>
                <td className={styles.lossWins}>{user.losses}</td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
    </div>
  );
}

export default Table;
