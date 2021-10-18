import HeadContainer from "../src/components/Head";
import Table from "../src/components/Table";

function Rooms({ quizzes }: any): React.ReactElement {
  return (
    <>
      <HeadContainer>Rooms</HeadContainer>
      <Table props={quizzes} type={"quizTable"}></Table>
    </>
  );
}

export async function getServerSideProps(): Promise<any> {
  const res: Response = await fetch(process.env.serverHost + "list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();

  return {
    props: { quizzes: data },
  };
}

export default Rooms;
