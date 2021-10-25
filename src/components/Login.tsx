import Button from "./Button";
import { useState, useEffect } from "react";
import styles from "../styles/login.module.css";

function Login(): React.ReactElement {
  const [login, setLogin] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [usernameState, setUsernameState] = useState(false);
  const [passwordState, setPasswordState] = useState(false);
  const [passwordMatchState, setPasswordMatchState] = useState(false);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("login") == "true") {
      setLogin(true);
    }
  }, []);

  function checkUsername(): void {
    let formData: FormData = new FormData(document.forms[0]);
    let usernameLength: number = formData.get("username")?.toString().length!;

    if (usernameLength >= 4) {
      setUsernameState(true);
    } else {
      setUsernameState(false);
    }
  }
  function checkPassword(): void {
    let formData: FormData = new FormData(document.forms[0]);
    let password: string = formData.get("password")?.toString()!;
    let passwordConfirm: string = formData.get("passwordConfirm")?.toString()!;
    let passwordLength: number = password.length;

    if (password != passwordConfirm) {
      setPasswordMatchState(false);
    }
    if (passwordLength >= 8) {
      setPasswordState(true);
      if (password == passwordConfirm) {
        setPasswordMatchState(true);
      } else {
        setPasswordMatchState(false);
      }
    } else {
      setPasswordState(false);
    }
  }

  function handleSubmit(event: any): void {
    event.preventDefault();
  }

  function handleLogin(): void {
    processRequest();
  }
  function handleRegistration(): void {
    let formData: FormData = new FormData(document.forms[0]);
    let password: string = formData.get("password")?.toString()!;
    let passwordConfirm: string = formData.get("passwordConfirm")?.toString()!;
    let passwordLength: number = formData.get("password")?.toString().length!;
    let usernameLength: number = formData.get("username")?.toString().length!;

    if (password == passwordConfirm && passwordLength >= 8 && usernameLength >= 4) {
      processRequest();
    }
  }

  async function processRequest(): Promise<void> {
    let formData: FormData = new FormData(document.forms[0]);
    let username: string = formData.get("username")?.toString()!;
    let res: Response;
    let response: string;

    function setLogin(_response: string): void {
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("username", response);
      window.location.reload();
    }

    if (!registration) {
      res = await fetch(process.env.serverHost + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      response = await res.text();

      if (response == username) {
        setLogin(response);
      } else {
        setMessage(true);
      }
    } else {
      res = await fetch(process.env.serverHost + "register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      response = await res.text();

      if (response == formData.get("username")) {
        setLogin(response);
      } else {
        setMessage(true);
      }
    }
  }
  return (
    <>
      {!login && (
        <section className={styles.modal}>
          {registration ? (
            <form className={styles.modalContent} onSubmit={handleSubmit}>
              <h2 className={styles.title}>Registration</h2>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  onChange={() => {
                    checkUsername();
                    setMessage(false);
                  }}
                />
              </label>
              <label>
                Password
                <input type="password" name="password" autoComplete="on" onChange={checkPassword} />
              </label>
              <label>
                Confirm Password
                <input type="password" name="passwordConfirm" autoComplete="on" onChange={checkPassword} />
              </label>
              {message ? (
                <Button title="username already taken" className={styles.errorBtn} />
              ) : (
                <Button title="Create Account" className={styles.btn} onClick={handleRegistration} />
              )}
              <ul className={styles.ul}>
                <li className={!usernameState ? styles.hintRed : styles.hintGreen}>Username: at least 4 characters</li>
                <li className={!passwordState ? styles.hintRed : styles.hintGreen}>Password: at least 8 characters</li>
                <li className={!passwordMatchState ? styles.hintRed : styles.hintGreen}>Passwords do match</li>
              </ul>
              <p className={styles.p}>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setRegistration(!registration), checkUsername(), checkPassword();
                  }}
                  className={styles.switch}
                >
                  Log in!
                </span>
              </p>
            </form>
          ) : (
            <form className={styles.modalContent} onSubmit={handleSubmit}>
              <h2 className={styles.title}>Login</h2>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  onChange={() => {
                    setMessage(false);
                  }}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete="on"
                  onChange={() => {
                    setMessage(false);
                  }}
                />
              </label>
              {message ? (
                <Button title="username or password wrong" className={styles.errorBtn} />
              ) : (
                <Button title="Login" className={styles.btn} onClick={handleLogin} />
              )}
              <p className={styles.p}>
                Don&#39;t have an account?{" "}
                <span
                  onClick={() => {
                    setRegistration(!registration), checkUsername(), checkPassword();
                  }}
                  className={styles.switch}
                >
                  Sign up!
                </span>
              </p>
            </form>
          )}
        </section>
      )}
    </>
  );
}

export default Login;
