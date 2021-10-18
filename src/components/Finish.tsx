import Link from "next/link";
import React from "react";
import { Bar } from "react-chartjs-2";
import styles from "../styles/quiz.module.css";

function Finish({ participants }: any): React.ReactElement {
  let participantsName: string[] = [];
  let participantsData: number[] = [];

  for (let key in participants) {
    participantsName.push(participants[key].username);
    participantsData.push(participants[key].points);
  }

  return (
    <div className={styles.barContainer}>
      <div className={styles.bar}>
        <Bar
          data={{
            labels: participantsName,
            datasets: [
              {
                label: " points",
                barPercentage: 0.5,
                data: participantsData,
                backgroundColor: "#ffbd52",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            indexAxis: "y",
            color: "white",
            responsive: true,
            scales: {
              x: {
                ticks: {
                  color: "white",
                  font: {
                    size: 15,
                  },
                },
              },
              y: {
                ticks: {
                  color: "#fff",
                  font: {
                    size: 15,
                  },
                },
              },
            },
            animation: {
              duration(ctx: any) {
                return ctx.raw * 500;
              },
              easing: "linear",
            },
          }}
        />
        <p className={styles.barHome}>
          <Link href={"/"}>
            <a>Home</a>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Finish;
