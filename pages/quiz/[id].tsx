import { useEffect, useState } from "react";
import Button from "../../src/components/Button";
import HeadContainer from "../../src/components/Head";
import styles from "../../src/styles/quiz.module.css";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import Winner from "../../src/components/Winner";
import getUsername from "../../src/hooks/getUsername";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let participantArray: any[] = [];

function Room({ quiz }: any): React.ReactElement {
  const [creator, setCreator] = useState(false);
  const [question, setQuestion] = useState(0);
  const [participants, setParticipants] = useState(participantArray);
  const [points, setPoints] = useState(0);
  const [winner, setWinner] = useState(false);
  const [lock, setLock] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let url: string = process.env.serverHost!;
    socket = io(url);
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (getUsername() == quiz.username) {
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
          username: getUsername(),
          roomnumber: quiz._id,
        })
      );
    }
  }, [quiz._id, quiz.id, quiz.username]);

  function handleAnswer(): void {
    let formData: FormData = new FormData(document.forms[0]);
    let answerLength: number = formData.get("answer")?.toString().length!;
    if (answerLength > 0) {
      socket.send(
        JSON.stringify({
          type: "answer",
          roomnumber: quiz._id,
          username: getUsername(),
          answer: formData.get("answer"),
        })
      );
    } else {
      setError(true);
    }
  }
  function endQuiz(): void {
    socket.send(
      JSON.stringify({
        type: "winner",
        roomnumber: quiz._id,
      })
    );
  }

  function clearLock(e: any): void {
    if (!lock) {
      setTextValue(e.target.value);
    }
    if (error) {
      setError(false);
    }
  }
  function clearError(): void {
    if (error) {
      setError(false);
    }
  }

  function unlockAll(): void {
    socket.send(
      JSON.stringify({
        type: "continue",
        roomnumber: quiz._id,
      })
    );
  }

  function subPoint(username: string): void {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: -1 }));
  }
  function subHalfPoint(username: string): void {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: -0.5 }));
  }
  function unlockAnswer(username: string): void {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, lock: "false" }));
  }
  function addHalfPoint(username: string): void {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: +0.5 }));
  }
  function addPoint(username: string): void {
    socket.send(JSON.stringify({ type: "change", roomnumber: quiz._id, username: username, points: +1 }));
  }

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
    socket.on("winner", () => {
      setWinner(true);
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
            {question > 0 ? (
              <Button className={styles.btn} title="Last" onClick={() => setQuestion(question - 1)} />
            ) : (
              <Button className={styles.btn} title="Locked" />
            )}
            <div className={styles.counter}>
              {question + 1} / {quiz.question.length}
            </div>
            {question + 1 == quiz.question.length ? (
              <Button
                className={styles.btn}
                title="End"
                onClick={() => {
                  endQuiz();
                }}
              />
            ) : (
              <Button
                className={styles.btn}
                title="Next"
                onClick={() => {
                  setQuestion(question + 1);
                  unlockAll();
                }}
              />
            )}
          </footer>
        </>
      ) : (
        <>
          <HeadContainer>Quiz - Participant</HeadContainer>
          <section className={styles.participant}>
            <p className={styles.p}>
              You made <span className={styles.participantSpan}>{points}</span>
              {points == 1 ? " point " : " points "} in&#160;
              <span className={styles.participantSpan}>{quiz.question.length}</span>
              {quiz.question.length == 1 ? " question " : " questions "}
            </p>
            <form className={styles.form}>
              <textarea
                className={!error ? (lock ? styles.lockedText : styles.textarea) : styles.error}
                name="answer"
                value={error ? "Please fill out the answer field" : textValue}
                onChange={clearLock}
                onClick={clearError}
              ></textarea>
              {error ? (
                <Button className={styles.participantBtnError} type="button" title="Locked" />
              ) : lock ? (
                <Button className={styles.participantBtnLocked} type="button" title="Locked In" />
              ) : (
                <Button className={styles.participantBtn} type="button" title="Answer" onClick={handleAnswer} />
              )}
            </form>
          </section>
        </>
      )}
      {winner && <Winner participants={participants} />}
    </>
  );
}

export async function getStaticPaths(): Promise<any> {
  const res: Response = await fetch(process.env.serverHost + "list", {
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
}

export async function getStaticProps(context: any): Promise<any> {
  const id = context.params.id;
  const res: Response = await fetch(process.env.serverHost + "list", {
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
}

export default Room;
