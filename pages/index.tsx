import HeadContainer from "../src/components/Head";
import styles from "../src/styles/index.module.css";
import getUsername from "../src/hooks/getUsername";
import Table from "../src/components/Table";

export default function Home({ allUser }: any): React.ReactElement {
  let winner: string = "";
  let user: number = 0;
  let loser: string = "";

  for (let key in allUser) {
    if (allUser[key].lastWin == true) {
      winner = allUser[key].username;
    }
    if (allUser[key].lastLoss == true) {
      loser = allUser[key].username;
    }
    if (allUser[key].username == getUsername()) {
      user = allUser[key].wins;
    }
  }

  return (
    <>
      <HeadContainer>Home</HeadContainer>
      <div className={styles.container}>
        <div className={styles.winner}>
          <p className={styles.title}>Last Winner</p>
          <p className={styles.data}>{winner}</p>
        </div>
        <div className={styles.wins}>
          <p className={styles.title}>Your Wins</p>
          <p className={styles.data}>{user}</p>
        </div>
        <div className={styles.loser}>
          <p className={styles.title}>Last Loser</p>
          <p className={styles.data}>{loser}</p>
        </div>
      </div>
      <Table props={allUser} type={"topList"}></Table>
    </>
  );
}

export async function getServerSideProps(): Promise<any> {
  const res: Response = await fetch(process.env.serverHost + "user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();

  return {
    props: { allUser: data },
  };
}
