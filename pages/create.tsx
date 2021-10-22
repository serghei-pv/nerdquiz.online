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
  const [filled, setFilled] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    setUsername(getUsername());
    setTimeout(() => {
      checkForm();
    });
  }, []);

  for (let i: number = 0; i < myQuiz.length; i++) {
    if (myQuiz[i].username == username) {
      myQuiz = myQuiz[i];
      for (slot; slot < myQuiz.question.length; slot++) {
        slotArray.push(<Slot key={slot.toString()} slot={slot} question={myQuiz.question[slot]} answer={myQuiz.answer[slot]}></Slot>);
      }
    } else if (i == myQuiz.length) {
    }
  }
  for (slot; slot < slots; slot++) {
    slotArray.push(<Slot key={slot.toString()} slot={slot}></Slot>);
  }
  if (myQuiz.question != undefined && myQuiz.question.length == 0 && slot == 0) {
    setSlots(slot + 1);
    slotArray.push(<Slot key={slot.toString()} slot={slot}></Slot>);
  }
  if (slot == 0) {
    slotArray.push(<Slot key={slot.toString()} slot={slot}></Slot>);
  }

  function add(): void {
    setSlots(slot + 1);
    window.scrollTo(0, document.body.scrollHeight);
    setFilled(false);
  }
  function undoLast(): void {
    setSlots(slot - 1);
    if (myQuiz.question != undefined) {
      myQuiz.question.pop();
      myQuiz.answer.pop();
    }
    setTimeout(() => {
      checkForm();
    });
  }

  function checkForm(): void {
    let formData: FormData = new FormData(document.forms[0]);
    let questionsEmpty: number = 0;
    let answersEmpty: number = 0;

    for (let key in formData.getAll("question")) {
      if (formData.getAll("question")[key] == "") {
        questionsEmpty++;
      }
      if (formData.getAll("answer")[key] == "") {
        answersEmpty++;
      }
    }
    if (questionsEmpty == 0 && answersEmpty == 0) {
      setFilled(true);
    } else if (questionsEmpty > 0 || answersEmpty > 0) {
      setFilled(false);
    }
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
      let res: Response = await fetch(process.env.serverHost + "save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          ready: "false",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      setResponse(await res.text());
      setTimeout(() => {
        setResponse("");
      }, 1500);
    } else if (type == "create") {
      let res: Response = await fetch(process.env.serverHost + "create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          ready: "true",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      setResponse(await res.text());
      setTimeout(() => {
        window.location.href = "/rooms";
      }, 1500);
    }
  }
  return (
    <>
      <HeadContainer>Create</HeadContainer>
      <form className={styles.form} onChange={() => checkForm()}>
        {slotArray}
      </form>
      <footer className={styles.footer}>
        <Button title="Add" className={styles.addBtn} onClick={add} />
        {slot > 1 ? <Button title="Undo Last" className={styles.undoBtn} onClick={undoLast} /> : <Button title="Locked" className={styles.undoBtn} />}
        <Button title="Save" className={styles.saveBtn} onClick={saveQuiz} />
        {filled ? <Button title="Create" className={styles.createBtn} onClick={createQuiz} /> : <Button title="Locked" className={styles.createBtn} />}
        {response != "" && <div className={styles.modalText}>{response}</div>}
      </footer>
    </>
  );
}

export async function getStaticProps(): Promise<any> {
  let res: Response = await fetch(process.env.serverHost + "load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  let myQuiz = await res.json();

  return {
    props: { myQuiz },
  };
}

export default Create;
