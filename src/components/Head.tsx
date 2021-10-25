import Head from "next/head";

function HeadContainer({ children }: any): React.ReactElement {
  return (
    <Head>
      <title>nerdQuiz | {children} </title>
      <meta name="description" content="A site for hosting self made quizzes online. To be played with friends. " />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#171719" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <link rel="apple-touch-icon" sizes="180x180" href="../../apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="../../favicon-16x16.png" />
      <link rel="manifest" href="../../site.webmanifest" />
    </Head>
  );
}

export default HeadContainer;
