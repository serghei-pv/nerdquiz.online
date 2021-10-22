<h1 align="center">Welcome to nerdQuiz</h1>

> A true online version for a nerdquiz, that my friends and I play from time to time.

## Website

[nerdquiz.online](www.nerdquiz.online)

## Context

<p>
Its just another reason to come together and have some fun, while being something less usual.
</p>

The loser from the last quiz has to host the next one. The quiz consists of questions to popular movies, games, cartoons and other similar topics, that were picked by the host. We usually just used excel for the host and wrote our answers on our phone display as "proof". How much points are possible to be earned per questions, depends on the host. As we try to expand beyond a simple question and answer format (examples: guess the quote or whos guess is the closest to the answer).

## What was used

I used this project to improve my skills and also try to learn something new. Because I interacted a lot with the DOM, it appeared a good idea to use a front end framework. As React is the most popular, I thought it was a good start. Because this project consists of multiple pages, I decided to use Nextjs. I also used Chartjs to animate and display the winner of a Quiz.

The [backend ](https://github.com/serghei-pv/myServer) on the other hand is being handled by Express and Socket.io. Express is used to interact with the database, in this case Mongodb. It stores information about the user and quizzes. Socket.io was logically used to send data between clients. That way answers and given points are displayed immediately and don't require an additional action.

## Explaining the pages

<p>
Home just displays your wins, the person who lost the last quiz and has to host the next one and the winner of the last quiz. Additionally a table shows the overall performance of all user.
</p>
![homepage](docs\design\home.png)
<p>
The "create tab" is the place to create the quiz. For each question you get a textarea for the question and one for the answer. You can add questions, remove questions, save the current state of the quiz or create it.
</p>
![create quiz tab](docs\design\create.png)

<p>
Room displays all the ready to use quizzes as rooms. If you join a room you join a quiz.
</p>
![rooms tab](docs\design\rooms.png)

<p>
If the quiz was made by you, it means you are the host and get the corresponding interface. Where You can click through the questions, get them displayed with the appropriate answer and also every single participant including name, points, buttons to add or subtract points, clear the locked in answer manually and the answer itself, if one was already given.
</p>
![host display without answers](docs\design\host.png)
![host display with answers](docs\design\host2.png)

<p>
If you aren't the host you get the participant interface. As the only thing you have to do is to answer, you get a textarea for your answers, a button to answer and a display of your points and how many questions there are.
</p>
![participant display no answer](docs\design\participant.png)
![participant display with answer](docs\design\participant2.png)

<p>
Finishing a quiz shows an animated bar graph.
</p>
![screen at the end of a quiz](docs\design\home.png)

## Author

👤 ** Serghei **

- Website: serghei-pv.me
- Github: [@serghei-pv ](https://github.com/serghei-pv)
