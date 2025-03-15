const emotions = [
    { emoji: "😊", answer: "Happy" },
    { emoji: "😂", answer: "Cheerful" },
    { emoji: "😢", answer: "Sad" },
    { emoji: "😡", answer: "Angry" },
    { emoji: "😨", answer: "Scared" },
    { emoji: "😎", answer: "Confident" },
    { emoji: "😔", answer: "Lonely" },
    { emoji: "😰", answer: "Nervous" },
    { emoji: "🤯", answer: "Frustrated" },
    { emoji: "😒", answer: "Jealous" },
    { emoji: "😳", answer: "Embarrassed" },
    { emoji: "😇", answer: "Grateful" },
    { emoji: "😍", answer: "Loving" },
    { emoji: "🥳", answer: "Excited" },
    { emoji: "😌", answer: "Proud" }
];

let currentQuestion = 0;
let score = 0;
let attempts = 5;
let timer;
let timeLeft = 10;

function loadQuestion() {
    if (attempts <= 0) {
        gameOver();
        return;
    }

    clearTimeout(timer);
    timeLeft = 10;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("attempts").textContent = attempts;

    let question = emotions[currentQuestion];
    document.getElementById("emoji").textContent = question.emoji;
    
    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    let shuffledOptions = emotions.map(e => e.answer).sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        let btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function checkAnswer(selected) {
    let correctAnswer = emotions[currentQuestion].answer;
    let feedback = document.getElementById("feedback");

    if (selected === correctAnswer) {
        feedback.textContent = "Correct!";
        feedback.className = "correct";
        score++;
        document.getElementById("score").textContent = score;
        document.getElementById("correctSound").play();

        // Move to the next question automatically
        currentQuestion++;
        setTimeout(loadQuestion, 1000); // Short delay before next question
    } else {
        feedback.textContent = "Wrong! The correct answer is " + correctAnswer;
        feedback.className = "wrong";
        document.getElementById("wrongSound").play();
        
        attempts--; // Reduce attempts
        document.getElementById("attempts").textContent = attempts;
        
        if (attempts <= 0) {
            gameOver();
        }
    }

    clearTimeout(timer);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        
        if (timeLeft <= 3) {
            document.getElementById("timer").classList.add("timer-warning");
        } else {
            document.getElementById("timer").classList.remove("timer-warning");
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer("Timeout");
        }
    }, 1000);
}

function gameOver() {
    document.getElementById("emoji").textContent = "💀";
    document.getElementById("options").innerHTML = `<p>Game Over! Your score: ${score}</p>`;
    document.getElementById("feedback").textContent = "You have used all your attempts!";
    clearTimeout(timer);
}

window.onload = loadQuestion;
