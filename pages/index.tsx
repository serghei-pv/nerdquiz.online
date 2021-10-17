import HeadContainer from "../src/components/Head";

export default function Home(): React.ReactElement {
  return <HeadContainer>Home</HeadContainer>;
}

// export async function getServerSideProps(): Promise<any> {
//   const res: Response = await fetch(process.env.serverHost + "userlist", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   });
//   const data = await res.json();

//   return {
//     props: { quizzes: data },
//   };
// }
