import styles from "../styles/create.module.css";
import HeadContainer from "./components/Head";
import Button from "./components/Button";
import { useState } from "react";
import { GetStaticProps } from "next";

const Create = ({ myQuiz }: any) => {
  let slotArray: any[] = [];
  let slot: number = slotArray.length;
  myQuiz = myQuiz[0];

  const [slots, setSlots] = useState(slot);

  if (slots == 0 && myQuiz != undefined) {
    for (slot; slot < myQuiz.question.length; slot++) {
      slotArray.push(
        <div key={slot.toString()} className={styles.slot}>
          <div className={styles.numberArea}>{slot + 1}</div>
          <textarea className={styles.question} name="question" defaultValue={myQuiz.question[slot]}></textarea>
          <textarea className={styles.answer} name="answer" defaultValue={myQuiz.answer[slot]}></textarea>
        </div>
      );
    }
  }

  for (slot; slot < slots; slot++) {
    slotArray.push(
      <div key={slot.toString()} className={styles.slot}>
        <div className={styles.numberArea}>Question {slot + 1}:</div>
        <textarea className={styles.question} name="question"></textarea>
        <span className={styles.span}>Answer:</span>
        <textarea className={styles.answer} name="answer"></textarea>
      </div>
    );
  }

  if (slot == 0) {
    setSlots(slot + 1);
    slotArray.push(
      <div key={slot.toString()} className={styles.slot}>
        <div className={styles.numberArea}>{slot + 1}</div>
        <textarea className={styles.question} name="question"></textarea>
        <textarea className={styles.answer} name="answer"></textarea>
      </div>
    );
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
          // username: sessionStorage.getItem("username"),
          username: "Serghei",
          ready: "false",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      let response = await res.text();
    } else if (type == "create") {
      let res: Response = await fetch("http://localhost:8100/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Serghei",
          ready: "true",
          question: formData.getAll("question"),
          answer: formData.getAll("answer"),
        }),
      });
      let response = await res.text();
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
};

export const getStaticProps: GetStaticProps = async () => {
  let res: Response = await fetch("http://localhost:8100/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  let myQuiz = await res.json();

  return {
    props: { myQuiz },
  };
};

export default Create;
