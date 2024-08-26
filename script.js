
const questions = [
    {
        question: "What is the default value of a boolean variable in Java?",
        answers: [
            { "text": "true", correct: false },
            { "text": "false", correct: true },
            { "text": "0", correct: false },
            { "text": "null", correct: false }
        ]
    },
    {
        question: "Which of the following is the correct way to declare a method that does not return any value?",
        answers: [
            { "text": "public void myMethod()", correct: true },
            { "text": "public myMethod()", correct: false },
            { "text": "public int myMethod()", correct: false },
            { "text": "public returnType myMethod()", correct: false }
        ]
    },
    {
        question: "What is the purpose of the `super` keyword in Java?",
        answers: [
            { "text": "To access parent class methods", correct: true },
            { "text": "To create an instance of a class", correct: false },
            { "text": "To declare a static method", correct: false },
            { "text": "To handle exceptions", correct: false }
        ]
    },
    {
        question: "Which of the following is not a Java access modifier?",
        answers: [
            { "text": "public", correct: false },
            { "text": "private", correct: false },
            { "text": "protected", correct: false },
            { "text": "secure", correct: true }
        ]
    },
    {
        question: "Which method is used to find the length of a string in Java?",
        answers: [
            { "text": "size()", correct: false },
            { "text": "length()", correct: true },
            { "text": "getSize()", correct: false },
            { "text": "getLength()", correct: false }
        ]
    }
];

function createApp() {
    const app = document.createElement('div');
    app.id = 'app';

    const header = document.createElement('h1');
    header.innerText = 'Java Technical Quiz';
    app.appendChild(header);

    const hr = document.createElement('hr');
    app.appendChild(hr);

    const nameContainer = document.createElement('div');
    nameContainer.id = 'nameContainer';

    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Enter your name: ';
    nameContainer.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.id = 'username';
    nameInput.type = 'text';
    nameInput.placeholder = 'Your Name';
    nameContainer.appendChild(nameInput);

    const startButton = document.createElement('button');
    startButton.id = 'startQuiz';
    startButton.innerText = 'Start Quiz';
    nameContainer.appendChild(startButton);

    app.appendChild(nameContainer);

    const quizz = document.createElement('div');
    quizz.id = 'quizz';
    quizz.style.display = 'none';

    const question = document.createElement('h2');
    question.id = 'question';
    question.innerText = 'Question';
    quizz.appendChild(question);

    const answerContainer = document.createElement('div');
    answerContainer.id = 'answer';
    quizz.appendChild(answerContainer);


    const nextButton = document.createElement('button');
    nextButton.id = 'next';
    nextButton.innerText = 'Next';
    nextButton.style.display = 'none';
    quizz.appendChild(nextButton);

    const exitButton = document.createElement('button');
    exitButton.id = 'exit';
    exitButton.innerText = 'Exit';
    exitButton.style.display = 'none';
    quizz.appendChild(exitButton);

    app.appendChild(quizz);

    const exitMessage = document.createElement('div');
    exitMessage.id = 'exitMessage';
    exitMessage.style.display = 'none';
    exitMessage.innerHTML = '<h2>Thanks for participating!</h2>';
    app.appendChild(exitMessage);

    document.body.appendChild(app);
}

createApp();

//localStorage.removeItem('leaderboard');


const questionElement = document.getElementById('question');
const answerButton = document.getElementById('answer');
const nextButton = document.getElementById('next');
const exitButton = document.getElementById('exit');
const exitMessage = document.getElementById('exitMessage');

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    const username = document.getElementById('username').value;
    if (username.trim() === '') {
        alert('Please enter your name.');
        return;
    }

    document.getElementById('nameContainer').style.display = 'none';
    document.getElementById('quizz').style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Next';
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButton.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('incorrect');
    }

    Array.from(answerButton.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    nextButton.style.display = 'block';
}

function saveScore(username, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: username, score: score });
    leaderboard.sort((a, b) => b.score - a.score); 
    if (leaderboard.length > 5) {
        leaderboard.length = 5; 
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showScore() {
    resetState();
    const username = document.getElementById('username').value;
    saveScore(username, score);
    showLeaderboard();
}

function showLeaderboard() {
    resetState();
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let leaderboardText = '<h2>TOP 5 IN LEADERBOARD</h2><ul>';
    
    leaderboard.slice(0, 5).forEach(entry => {
        leaderboardText += `<li>${entry.name}: ${entry.score}</li>`;
    });
    
    leaderboardText += '</ul>';
    questionElement.innerHTML = leaderboardText;
    nextButton.style.display = 'none'; 
    exitButton.style.display = 'inline-block'; 
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

document.getElementById('startQuiz').addEventListener('click', startQuiz);

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        showScore();
    }
});

exitButton.addEventListener("click", () => {
    document.getElementById('quizz').style.display = 'none';
    document.getElementById('exitMessage').style.display = 'block';
});
