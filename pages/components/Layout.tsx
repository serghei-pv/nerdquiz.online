import Header from "./Header";
import Login from "./Login";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      {children}
      <Login />
    </>
  );
};

export default Layout;
