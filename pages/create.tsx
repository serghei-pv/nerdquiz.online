import styles from "../src/styles/create.module.css";
import HeadContainer from "../src/components/Head";
import Button from "../src/components/Button";
import Slot from "../src/components/Slot";
import { useEffect, useState } from "react";
import getUsername from "../src/hooks/getUsername";

function Create({ myQuiz }: any): React.ReactElement {
  let slotArray: any[] = [];
  let slot: number = slotArray.length;

  const [slots, setSlots] = useState(slot);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  for (let i: number = 0; i < myQuiz.length; i++) {
    if (myQuiz[i].username == username) {
      myQuiz = myQuiz[i];
      for (slot; slot < myQuiz.question.length; slot++) {
        slotArray.push(<Slot key={slot.toString()} slot={slot} question={myQuiz.question[slot]} answer={myQuiz.answer[slot]}></Slot>);
      }
    }
  }

  for (slot; slot < slots; slot++) {
    slotArray.push(<Slot key={slot.toString()} slot={slot}></Slot>);
  }
  if (slot == 0) {
    setSlots(slot + 1);
    slotArray.push(<Slot key={slot.toString()} slot={slot}></Slot>);
  }

  function saveQuiz(): void {
    processRequest("save");
  }
  function createQuiz(): void {
    processRequest("create");
  }

  async function processRequest(type: string): Promise<void> {
    let formData: FormData = new FormData(document.forms[0]);

    if (type == "save") {
      let res: Response = await fetch("http://localhost:8100/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          ready: "false",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      let response = await res.text();
      console.log(response);
    } else if (type == "create") {
      let res: Response = await fetch("http://localhost:8100/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          ready: "true",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      let response = await res.text();
      console.log(response);
    }
  }
  return (
    <>
      <HeadContainer>Create</HeadContainer>
      <form className={styles.form}>{slotArray}</form>
      <footer className={styles.footer}>
        <Button
          title="Add"
          className={styles.btn}
          onClick={() => {
            setSlots(slot + 1);
            window.scrollTo(0, document.body.scrollHeight);
          }}
        />
        <Button title="Undo Last" className={styles.btn} onClick={() => (slots == 1 ? console.log("no!") : setSlots(slot - 1))} />
        <Button title="Save" className={styles.btn} onClick={saveQuiz} />
        <Button title="Create" className={styles.btn} onClick={createQuiz} />
      </footer>
    </>
  );
}

export async function getStaticProps(): Promise<any> {
  let res: Response = await fetch("http://localhost:8100/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  let myQuiz = await res.json();

  return {
    props: { myQuiz },
  };
}

export default Create;
