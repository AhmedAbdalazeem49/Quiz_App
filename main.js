// Select Elements
let countSpan = document.querySelector(".count span");
let categorySpan = document.querySelector(".category span");
let bullets = document.querySelector(".bullets");
let BulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let languagesButtons = document.querySelectorAll(".languages button");


// set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// Function To Get The Questions From the Json File Using Old Way "Ajax"
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  languagesButtons.forEach((button) => {
    button.onclick = () => {
      myRequest.open("GET", `${button.innerHTML}_Questions.json`, true);
      myRequest.send();
      // Remove All Buttons
      document.querySelector(".languages").remove();
      categorySpan.innerHTML = button.innerHTML;
    };
  });

  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionsCount = questionObject.length;

      // Create Bullets + Set Questions Count
      createBullets(questionsCount);

      // Add Questions Data
      addQuestionData(questionObject[currentIndex], questionsCount);

      // Start CountDown
      countdown(10, questionsCount);

      // Click on Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionObject[currentIndex].right_answer;

        // Check the answer
        checkAnswer(theRightAnswer, questionsCount);

        // Increase index
        currentIndex++;

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Questions Data "For the next Question"
        addQuestionData(questionObject[currentIndex], questionsCount);

        // Handle Bullets Class
        handleBullets();

        // Start Countdown
        clearInterval(countdownInterval);
        countdown(10, questionsCount);

        // Show Results
        showResults(questionsCount);
      };
    }
  };
}
getQuestions();

// Function To Create Bullets and Questions Count
function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create bullet
    let bullet = document.createElement("span");

    // Add on class to the first bullet
    if (i === 0) {
      bullet.classList.add("on");
    }

    // Append Bullets to main bullet Container
    BulletsSpanContainer.appendChild(bullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 For the Questions
    let question = document.createElement("h2");
    question.innerText = obj.title;
    // Add The Question To The Quiz Area
    quizArea.appendChild(question);

    // Create div for each answer
    for (let i = 1; i <= 4; i++) {
      // Create div
      let answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");

      // create Radio Button
      let radioButton = document.createElement("input");
      // set the input type "Attributes"
      radioButton.type = "radio";
      radioButton.name = "questions";
      radioButton.id = `answer_${i}`;
      radioButton.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (radioButton.id == `answer_1`) {
        radioButton.checked = true;
      }
      // Add radio button to the div
      answerDiv.appendChild(radioButton);

      // Create The label for the answer
      let label = document.createElement("label");
      // Set label Attributes
      label.setAttribute("for", `answer_${i}`);
      label.innerText = obj[`answer_${i}`];
      // Add label to the answerDiv
      answerDiv.appendChild(label);

      // Add the answer Div to the answers Area
      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  // Compare the chosen answer with the right answer
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} form ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers are Right.`;
    } else {
      theResults = `<span class="bad">Bad</span>,${rightAnswers} form ${count}`;
    }
    resultsContainer.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        // Click on the submit button to continue in the Quiz
        submitButton.click();
      }
    }, 1000);
  }
}
