import Header from "./Header";
import Login from "./Login";

function Layout({ children }: any): React.ReactElement {
  return (
    <>
      <html lang="en" />
      <Header />
      <Login />
      {children}
    </>
  );
}

export default Layout;
