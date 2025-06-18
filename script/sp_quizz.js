const wordPairs = [
  { singular: "Mouse", plural: "Mice" },
  { singular: "Man", plural: "Men" },
  { singular: "Woman", plural: "Women" },
  { singular: "Child", plural: "Children" },
  { singular: "Leaf", plural: "Leaves" },
  { singular: "Wolf", plural: "Wolves" },
  { singular: "Ox", plural: "Oxen" },
  { singular: "Fox", plural: "Foxes" },
  { singular: "Goose", plural: "Geese" },
  { singular: "Tooth", plural: "Teeth" },
];

let currentQuestion = 0;
let correctAnswers = 0;
let usedPairs = [];
let startTime = 0;
let totalQuestions = 10;

function startQuiz() {
  currentQuestion = 0;
  correctAnswers = 0;
  usedPairs = [];
  document.getElementById("result").classList.add("hidden");
  document.getElementById("restartBtn").textContent = "Restart";
  startTime = Date.now();
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestion >= totalQuestions) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("quiz-container");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").innerHTML = `
      <p>✅ Correct: ${correctAnswers} / ${totalQuestions}</p>
      <p>⏱️ Time: ${timeTaken} seconds</p>
    `;
    return;
  }

  const index = Math.floor(Math.random() * wordPairs.length);
  const word = wordPairs[index];

  // 50% chance: ask for singular or plural
  const askSingular = Math.random() > 0.5;
  const questionWord = askSingular ? word.singular : word.plural;
  const correctAnswer = askSingular ? word.plural : word.singular;

  // Prevent repeat
  usedPairs.push(`${askSingular}-${index}`);

  // Generate options
  let options = new Set();
  options.add(correctAnswer);
  while (options.size < 4) {
    const random = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const distractor = askSingular ? random.plural : random.singular;
    if (distractor !== correctAnswer) options.add(distractor);
  }

  const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

  document.getElementById("question").textContent = `What is the ${askSingular ? "plural" : "singular"} of "${questionWord}"?`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  shuffledOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === correctAnswer) {
        correctAnswers++;
        document.getElementById("message").textContent = "Correct!";
      } else {
        document.getElementById("message").textContent = "Oops!";
      }
      currentQuestion++;
      setTimeout(() => {
        document.getElementById("message").textContent = "";
        nextQuestion();
        document.getElementById("progress").textContent = `${currentQuestion} / ${totalQuestions}`;
      }, 800);
    };
    optionsDiv.appendChild(btn);
  });

  document.getElementById("progress").textContent = `${currentQuestion + 1} / ${totalQuestions}`;
}
