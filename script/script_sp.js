const words = [
  { singular: "Mouse", plural: "Mice" },
  { singular: "Man", plural: "Men" },
  { singular: "Woman", plural: "Women" },
  { singular: "Child", plural: "Children" },
  { singular: "Leaf", plural: "Leaves" },
  { singular: "Wolf", plural: "Wolves" },
  { singular: "Ox", plural: "Oxen" },
  { singular: "Fox", plural: "Foxes" },
  { singular: "Goose", plural: "Geese" },
  { singular: "Tooth", plural: "Teeth" }
];

let correct = 0;
let timeLeft = 60;
let timerInterval;

const singularsDiv = document.getElementById("singulars");
const pluralsDiv = document.getElementById("plurals");
const messageDiv = document.getElementById("message");
const timerSpan = document.getElementById("timer");
const correctCount = document.getElementById("correctCount");
const recordTimeSpan = document.getElementById("recordTime");
const restartBtn = document.getElementById("restartBtn");

function initGame() {
  singularsDiv.innerHTML = "<h2>Singular</h2>";
  pluralsDiv.innerHTML = "<h2>Plural</h2>";
  messageDiv.textContent = "";
  correct = 0;
  correctCount.textContent = "0";
  timeLeft = 60;
  timerSpan.textContent = timeLeft;

  const shuffled = [...words].sort(() => Math.random() - 0.5);

  words.forEach((item) => {
    const sBox = document.createElement("div");
    sBox.className = "word";
    sBox.textContent = item.singular;
    sBox.dataset.word = item.singular;
    sBox.ondragover = (e) => e.preventDefault();
    sBox.ondrop = (e) => drop(e, item.singular);
    singularsDiv.appendChild(sBox);
  });

  shuffled.forEach((item) => {
    const pBox = document.createElement("div");
    pBox.className = "word";
    pBox.textContent = item.plural;
    pBox.draggable = true;
    pBox.dataset.singular = item.singular;
    pBox.ondragstart = (e) => drag(e, item.singular);
    pluralsDiv.appendChild(pBox);
  });

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function drag(ev, singular) {
  ev.dataTransfer.setData("text", singular);
}

function drop(ev, targetSingular) {
  const draggedSingular = ev.dataTransfer.getData("text");
  const targetBox = ev.target;

  if (draggedSingular === targetSingular && targetBox.textContent.indexOf("✓") === -1) {
    // Cambiar estilo y marcar singular
    targetBox.style.backgroundColor = "#c8e6c9";
    targetBox.textContent += " ✓";
    targetBox.ondrop = null;
    targetBox.ondragover = null;

    // Buscar y marcar el plural correspondiente
    const pluralBoxes = pluralsDiv.querySelectorAll(".word");
    pluralBoxes.forEach((pBox) => {
      if (pBox.dataset.singular === draggedSingular) {
        pBox.style.backgroundColor = "#c8e6c9";
        pBox.textContent += " ✓";
        pBox.draggable = false;
        pBox.style.cursor = "default";
      }
    });

    correct++;
    correctCount.textContent = correct;
    messageDiv.textContent = "Great!";
    if (correct === words.length) {
      clearInterval(timerInterval);
      endGame(true);
    }
  } else {
    messageDiv.textContent = "Try again!";
  }

  setTimeout(() => (messageDiv.textContent = ""), 1200);
}


function endGame(success) {
  if (success) {
    messageDiv.textContent = "🎉 You matched them all!";
    saveRecord(60 - timeLeft);
  } else {
    messageDiv.textContent = "⏳ Time's up! Try again.";
  }
}

function saveRecord(currentTime) {
  const previous = localStorage.getItem("bestPluralTime");
  if (!previous || currentTime < parseInt(previous)) {
    localStorage.setItem("bestPluralTime", currentTime);
    recordTimeSpan.textContent = currentTime;
  }
}

function showRecord() {
  const best = localStorage.getItem("bestPluralTime");
  recordTimeSpan.textContent = best ? best : "--";
}

restartBtn.addEventListener("click", initGame);

// Start game on load
showRecord();
initGame();
