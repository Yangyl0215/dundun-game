const animals = {
  chick: {
    face: "🐥",
    messages: ["小鸡你好", "叽叽叽", "黄黄的小鸡"],
    prompts: ["找一找小鸡", "拍拍小鸡", "小鸡在哪里呀"],
    colors: ["#ffe58f", "#ffc98b"],
    tone: 660,
  },
  bunny: {
    face: "🐰",
    messages: ["小兔跳跳", "耳朵长长", "白白的小兔"],
    prompts: ["小兔想跳跳", "拍拍小兔", "长耳朵在哪里"],
    colors: ["#ffd7e8", "#f8aeca"],
    tone: 760,
  },
  bear: {
    face: "🐻",
    messages: ["小熊抱抱", "软软的小熊", "你好呀"],
    prompts: ["小熊来抱抱", "拍拍小熊", "小熊醒醒啦"],
    colors: ["#d9a36a", "#bd7f45"],
    tone: 520,
  },
  cat: {
    face: "🐱",
    messages: ["小猫喵喵", "摸摸胡子", "橘色小猫"],
    prompts: ["小猫在这里", "拍拍小猫", "小猫说喵喵"],
    colors: ["#ffc36b", "#ff9d55"],
    tone: 700,
  },
};

const animalButton = document.querySelector("#animalButton");
const animalFace = document.querySelector("#animalFace");
const message = document.querySelector("#message");
const prompt = document.querySelector("#prompt");
const choices = document.querySelectorAll(".choice");
const parentTipButton = document.querySelector("#parentTipButton");
const parentSheet = document.querySelector("#parentSheet");
const sheetClose = document.querySelector("#sheetClose");

let currentAnimal = "chick";
let audioContext;
let messageIndex = 0;

function setAnimal(animalName) {
  const animal = animals[animalName];
  currentAnimal = animalName;
  messageIndex = 0;
  animalFace.textContent = animal.face;
  message.textContent = "拍拍我";
  prompt.textContent = animal.prompts[0];
  animalButton.style.background = `
    radial-gradient(circle at 36% 28%, rgba(255, 255, 255, 0.82), transparent 27%),
    linear-gradient(145deg, ${animal.colors[0]}, ${animal.colors[1]})
  `;

  choices.forEach((choice) => {
    choice.classList.toggle("is-active", choice.dataset.animal === animalName);
  });
}

function playSoftTone(frequency) {
  const BrowserAudioContext = window.AudioContext || window.webkitAudioContext;

  if (!BrowserAudioContext) {
    return;
  }

  audioContext ||= new BrowserAudioContext();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.22, now + 0.16);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.24);
}

function showConfetti(x, y) {
  const colors = ["#ff8c72", "#ffd45c", "#7cc88a", "#79c7d7"];

  for (let i = 0; i < 10; i += 1) {
    const dot = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 10;
    const distance = 76 + Math.random() * 34;

    dot.className = "confetti";
    dot.style.setProperty("--x", `${x}px`);
    dot.style.setProperty("--y", `${y}px`);
    dot.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    dot.style.setProperty("--color", colors[i % colors.length]);

    document.body.append(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }
}

function celebrate(event) {
  const animal = animals[currentAnimal];
  const rect = animalButton.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;

  message.textContent = animal.messages[messageIndex % animal.messages.length];
  prompt.textContent = animal.prompts[messageIndex % animal.prompts.length];
  messageIndex += 1;

  animalButton.classList.add("is-bouncing");
  window.setTimeout(() => animalButton.classList.remove("is-bouncing"), 180);

  playSoftTone(animal.tone);
  showConfetti(x, y);
}

function openParentSheet() {
  parentSheet.hidden = false;
}

function closeParentSheet() {
  parentSheet.hidden = true;
}

animalButton.addEventListener("click", celebrate);
parentTipButton.addEventListener("click", openParentSheet);
sheetClose.addEventListener("click", closeParentSheet);
parentSheet.addEventListener("click", (event) => {
  if (event.target === parentSheet) {
    closeParentSheet();
  }
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    setAnimal(choice.dataset.animal);
    playSoftTone(animals[choice.dataset.animal].tone * 0.84);
  });
});

setAnimal(currentAnimal);
