import Header from "./Header";
import Login from "./Login";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <Login />
      {children}
    </>
  );
};

export default Layout;
