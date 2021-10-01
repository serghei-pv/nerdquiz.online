import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import HeadContainer from "../components/Head";
import styles from "../../styles/quiz.module.css";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let participantArray: any[] = [];

const Room = ({ quiz }: any) => {
  const [creator, setCreator] = useState(false);
  const [question, setQuestion] = useState(0);
  const [participants, setParticipants] = useState(participantArray);
  const [points, setPoints] = useState(0);
  const [lock, setLock] = useState(false);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    socket = io("http://localhost:8100");
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("username") == quiz.username) {
      setCreator(true);
      socket.send(
        JSON.stringify({
          type: "host",
          roomnumber: quiz._id,
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          type: "participant",
          username: sessionStorage.getItem("username"),
          roomnumber: quiz._id,
        })
      );
    }
  }, [quiz._id, quiz.id, quiz.username]);

  const handleAnswer = () => {
    let formData: FormData = new FormData(document.forms[0]);
    socket.send(
      JSON.stringify({
        type: "answer",
        roomnumber: quiz._id,
        username: sessionStorage.getItem("username"),
        answer: formData.get("answer"),
      })
    );
  };

  const clear = (e: any) => {
    if (!lock) {
      setTextValue(e.target.value);
    }
  };

  const unlockAll = () => {
    socket.send(
      JSON.stringify({
        type: "continue",
        roomnumber: quiz._id,
      })
    );
  };

  const subPoint = (username: string) => {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: -1 }));
  };
  const subHalfPoint = (username: string) => {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: -0.5 }));
  };
  const unlockAnswer = (username: string) => {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, lock: "false" }));
  };
  const addHalfPoint = (username: string) => {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: +0.5 }));
  };
  const addPoint = (username: string) => {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: +1 }));
  };

  useEffect(() => {
    socket.on("update", (message) => {
      let data = JSON.parse(message.toLocaleString());
      setParticipants(data);

      for (let key in data) {
        if (sessionStorage.getItem("username") == data[key].username) {
          setPoints(data[key].points);

          if (data[key].lock == "true") {
            setLock(true);
          }
          if (data[key].lock == "false") {
            setLock(false);
            setTextValue("");
          }
        }
      }
    });
    return function cleanup() {
      socket.off("update");
    };
  });

  return (
    <>
      {creator ? (
        <>
          <HeadContainer>Quiz - Host</HeadContainer>
          <main className={styles.main}>
            <section className={styles.host}>
              <div className={styles.top}>
                <p className={styles.question}>{quiz.question[question]}</p>
                <p className={styles.answers}>{quiz.answer[question]}</p>
              </div>
              <div className={styles.bottom}>
                {participants.map((participant: any) => (
                  <div key={participant.username} className={participant.answer == "" ? styles.participantContainer : styles.participantContainerBlue}>
                    <div className={styles.rowOne}>
                      <p className={styles.participantName}>{participant.username}</p>
                      <p className={styles.participantPoints}>{participant.points}</p>
                    </div>
                    <div className={styles.rowTwo}>
                      <button className={styles.participantSubPoint} onClick={() => subPoint(participant.username)}>
                        -1
                      </button>
                      <button className={styles.participantSubHalfPoint} onClick={() => subHalfPoint(participant.username)}>
                        -0.5
                      </button>
                      <button className={styles.participantUnlock} onClick={() => unlockAnswer(participant.username)}>
                        clear
                      </button>
                      <button className={styles.participantAddHalfPoint} onClick={() => addHalfPoint(participant.username)}>
                        +0.5
                      </button>
                      <button className={styles.participantAddPoint} onClick={() => addPoint(participant.username)}>
                        +1
                      </button>
                    </div>
                    <div className={styles.rowThree}>
                      <p className={styles.participantAnswer}>{participant.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
          <footer className={styles.footer}>
            <Button className={styles.btn} title="Last" onClick={() => (question == 0 ? console.log("no!") : setQuestion(question - 1))} />
            <div className={styles.counter}>
              {question + 1} / {quiz.question.length}
            </div>
            <Button
              className={styles.btn}
              title="Next"
              onClick={() => {
                question + 1 == quiz.question.length ? console.log("no!") : setQuestion(question + 1);
                unlockAll();
              }}
            />
          </footer>
        </>
      ) : (
        <>
          <HeadContainer>Quiz - Participant</HeadContainer>
          <section className={styles.participant}>
            <form className={styles.form}>
              <textarea className={lock ? styles.lockedText : styles.textarea} name="answer" value={textValue} onChange={clear}></textarea>
              <Button className={lock ? styles.lockedBtn : styles.btn} type="button" title="Answer" onClick={handleAnswer} />
              <p className={styles.p}>
                {points} / {quiz.question.length}
              </p>
            </form>
          </section>
        </>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("http://localhost:8100/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();

  const paths = data.map((quiz: any) => {
    return {
      params: { id: quiz._id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context: any) => {
  const id = context.params.id;
  const res = await fetch("http://localhost:8100/list/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
    }),
  });
  const data = await res.json();

  return {
    props: { quiz: data },
  };
};

export default Room;
