import Button from "./Button";
import { useState, useEffect } from "react";

const Login = () => {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("login") == "true") {
      setLogin(true);
    }
  }, []);

  function handleClick(): void {
    processRequest();
  }

  async function processRequest(): Promise<void> {
    let formData: FormData = new FormData(document.forms[0]);
    let res: Response = await fetch("http://localhost:8100/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
      }),
    });
    let response = await res.text();

    if (response == formData.get("username")) {
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("username", response);
      window.location.reload();
    }
  }
  return (
    <>
      {!login && (
        <section className={"modalLogin"}>
          <form className="modalLoginContent">
            <input type="text" placeholder="Username" name="username" className="loginInput" />
            <Button title="Continue" className="btn" onClick={handleClick} />
          </form>
        </section>
      )}
    </>
  );
};

export default Login;
