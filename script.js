let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let lapTimes = [];
let isRunning = false;

const display = document.getElementById("display");
const laps = document.getElementById("laps");
const themeToggle = document.createElement("button");
themeToggle.className = "theme-toggle";
themeToggle.innerHTML = "🌓";
document.body.appendChild(themeToggle);

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("lap").addEventListener("click", recordLap);
themeToggle.addEventListener("click", toggleTheme);

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTime, 10);
  playSound('start');
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
  playSound('pause');
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  lapTimes = [];
  display.textContent = "00:00:00.000";
  laps.innerHTML = "";
  playSound('reset');
}

function recordLap() {
  if (!isRunning) return;
  
  const currentTime = Date.now() - startTime;
  const lapTime = formatTime(currentTime);
  lapTimes.push(currentTime);
  
  const li = document.createElement("li");
  
  let lapDiff = "";
  if (lapTimes.length > 1) {
    const diff = currentTime - lapTimes[lapTimes.length - 2];
    lapDiff = `<span class="lap-diff">+${formatTime(diff, true)}</span>`;
  }
  
  li.innerHTML = `Lap ${lapTimes.length}: ${lapTime} ${lapDiff}`;
  laps.insertBefore(li, laps.firstChild);
  playSound('lap');
}

function updateTime() {
  elapsedTime = Date.now() - startTime;
  display.textContent = formatTime(elapsedTime);
}

function formatTime(time, short = false) {
  let ms = time % 1000;
  let totalSeconds = Math.floor(time / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  let seconds = totalSeconds % 60;
  
  if (short) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}`;
  }
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}`;
}

function pad(num, length = 2) {
  return num.toString().padStart(length, '0');
}

function playSound(type) {
  const sounds = {
    start: [1400, 200, 0.3],
    pause: [800, 300, 0.2],
    reset: [400, 500, 0.4],
    lap: [1200, 100, 0.2]
  };
  
  const [frequency, duration, volume] = sounds[type];
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}